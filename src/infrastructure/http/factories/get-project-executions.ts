import { Pagination } from "@application/value-objects/pagination"
import { TaskExecutionDTO } from "@infrastructure/http/dto/task-execution"
import { GetProjectExecutionsUseCase } from "@application/ports/use-cases/get-project-executions"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { TaskExecution } from "@domain/task-execution"
import { TaskExecutionMapper } from "../mappers/task-execution"

export function createGetProjectExecutionsHandler(getProjectExecutionsUseCase: GetProjectExecutionsUseCase) {
	return async function getProjectExecutionsHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		try {

            const projectId = event.pathParameters?.projectId
			if (!projectId) {
				throw new ValidationError("Missing required path param: projectId")
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

			const taskExecutions: TaskExecution[] = await getProjectExecutionsUseCase.execute(projectId, pagination)
            const taskExecutionDTOs: TaskExecutionDTO[] = TaskExecutionMapper.toDTOs(taskExecutions)
			return Responses._200(taskExecutionDTOs)
		} catch (error) {
			console.error("Error fetching project timeline:", error)
			return errorHandler(error)
		}
	}
}
