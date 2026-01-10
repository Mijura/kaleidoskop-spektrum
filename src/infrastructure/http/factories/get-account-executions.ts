import { TaskExecutionDTO } from "@infrastructure/http/dto/task-execution"
import { GetAccountExecutions } from "@application/ports/use-cases/get-account-executions"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { TaskExecution } from "@domain/task-execution"
import { TaskExecutionMapper } from "../mappers/task-execution"
import { Pagination } from "@application/value-objects/pagination"

export function createGetAccountExecutionsHandler(getAccountExecutionsUseCase: GetAccountExecutions) {
	return async function getAccountExecutionsHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		try {

            const accountId = event.pathParameters?.accountId
			if (!accountId) {
				throw new ValidationError("Missing required path param: accountId")
			}

			const qs = event.queryStringParameters || {}

			const pageNumber = qs.page ? parseInt(qs.page, 10) : 1
			const pageSize = qs.size ? parseInt(qs.size, 10) : 25

			if (!accountId) {
				throw new ValidationError("Missing required query param: projectId")
			}

			if (Number.isNaN(pageNumber) || Number.isNaN(pageSize)) {
				throw new ValidationError("Invalid page or size query params")
			}

			const pagination: Pagination = {
				pageNumber: pageNumber,
				pageSize: pageSize,
			}

			const taskExecutions: TaskExecution[] = await getAccountExecutionsUseCase.execute(accountId, pagination)
            const taskExecutionDTOs: TaskExecutionDTO[] = TaskExecutionMapper.toDTOs(taskExecutions)
			return Responses._200(taskExecutionDTOs)
		} catch (error) {
			console.error("Error fetching account timeline:", error)
			return errorHandler(error)
		}
	}
}
