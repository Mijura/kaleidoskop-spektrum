import { TaskExecutionDTO } from "@infrastructure/http/dto/task-execution"
import { GetAccountExecutionsUseCase, GetAccountExecutionsUseCaseParams } from "@application/ports/use-cases/get-account-executions"
import { errorHandler, Responses, ValidationError } from "@jigjoy-ai/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { TaskExecution } from "@domain/task-execution"
import { TaskExecutionMapper } from "../mappers/task-execution"
import { Pagination } from "@application/value-objects/pagination"
import { Auth } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"
import { extractAuthData } from "@heksagon/http"

export function createGetAccountExecutionsHandler(getAccountExecutionsUseCase: GetAccountExecutionsUseCase) {
	return async function getAccountExecutionsHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		try {

			const qs = event.queryStringParameters || {}

			const pageNumber = qs.page ? parseInt(qs.page, 10) : 1
			const pageSize = qs.size ? parseInt(qs.size, 10) : 25

			if (Number.isNaN(pageNumber) || Number.isNaN(pageSize)) {
				throw new ValidationError("Invalid page or size query params")
			}


			const auth: Auth<UserData> = extractAuthData(event)

			const pagination: Pagination = {
				pageNumber: pageNumber,
				pageSize: pageSize,
			}

			const params: GetAccountExecutionsUseCaseParams = {
				pagination,
			}
			const taskExecutions: TaskExecution[] = await getAccountExecutionsUseCase.execute(auth, params)
            
			const taskExecutionDTOs: TaskExecutionDTO[] = TaskExecutionMapper.toDTOs(taskExecutions)
			return Responses._200(taskExecutionDTOs)
		} catch (error) {
			console.error("Error fetching account timeline:", error)
			return errorHandler(error)
		}
	}
}
