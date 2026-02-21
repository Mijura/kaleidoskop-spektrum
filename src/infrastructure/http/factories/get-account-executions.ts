import { TaskExecutionDTO } from "@infrastructure/http/dto/task-execution"
import { GetAccountExecutionsUseCase } from "@application/ports/use-cases/get-account-executions"
import { errorHandler, Responses, ValidationError } from "@jigjoy-ai/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { TaskExecution } from "@domain/task-execution"
import { TaskExecutionMapper } from "../mappers/task-execution"
import { Pagination } from "@application/value-objects/pagination"

export function createGetAccountExecutionsHandler(getAccountExecutionsUseCase: GetAccountExecutionsUseCase) {
	return async function getAccountExecutionsHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		try {
			const userId = event.headers["x-user-id"] || event.headers["X-User-Id"]
			if (!userId) {
				throw new ValidationError("Missing required header: x-user-id or X-User-Id")
			}

			const qs = event.queryStringParameters || {}

			const pageNumber = qs.page ? parseInt(qs.page, 10) : 1
			const pageSize = qs.size ? parseInt(qs.size, 10) : 25

			if (Number.isNaN(pageNumber) || Number.isNaN(pageSize)) {
				throw new ValidationError("Invalid page or size query params")
			}

			const pagination: Pagination = {
				pageNumber: pageNumber,
				pageSize: pageSize,
			}

			const taskExecutions: TaskExecution[] = await getAccountExecutionsUseCase.execute(userId, pagination)
			const taskExecutionDTOs: TaskExecutionDTO[] = TaskExecutionMapper.toDTOs(taskExecutions)
			return Responses._200(taskExecutionDTOs)
		} catch (error) {
			console.error("Error fetching account timeline:", error)
			return errorHandler(error)
		}
	}
}
