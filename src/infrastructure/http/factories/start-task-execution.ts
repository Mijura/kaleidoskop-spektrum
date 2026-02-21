import { StartTaskExecutionUseCase } from "@application/ports/use-cases/start-task-execution"
import { TaskExecutionDTO } from "@infrastructure/http/dto/task-execution"
import { TaskExecution } from "@domain/task-execution"
import { errorHandler, Responses, ValidationError } from "@jigjoy-ai/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { TaskExecutionMapper } from "@infrastructure/http/mappers/task-execution"

export function createStartTaskExecutionHandler(startTaskExecutionUseCase: StartTaskExecutionUseCase) {
	return async function startTaskExecutionHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		try {
			if (!event.body) throw new ValidationError("No body")

			const { title, projectId, taskId } = JSON.parse(event.body)
			if (!title || !projectId || !taskId) {
				throw new ValidationError("Missing required body params")
			}

			const userId = event.headers["x-user-id"] || event.headers["X-User-Id"]
			if (!userId) {
				throw new ValidationError("Missing required header: x-user-id or X-User-Id")
			}

			const taskExecution: TaskExecution = await startTaskExecutionUseCase.execute(
				title,
				projectId,
				taskId,
				userId,
			)
			const taskExecutionDTO: TaskExecutionDTO = TaskExecutionMapper.toDTO(taskExecution)
			return Responses._201(taskExecutionDTO)
		} catch (error) {
			console.error("Error starting task execution:", error)
			return errorHandler(error)
		}
	}
}
