import { StartTaskExecutionUseCase } from "@application/ports/use-cases/start-task-execution"
import { TaskExecutionDTO } from "@infrastructure/http/dto/task-execution"
import { TaskExecution } from "@domain/task-execution"
import { errorHandler, Responses, ValidationError } from "@jigjoy-ai/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { TaskExecutionMapper } from "@infrastructure/http/mappers/task-execution"

export function createStartTaskExecutionHandler(startTaskExecutionUseCase: StartTaskExecutionUseCase) {
	return async function startTaskExecutionHandler({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		try {

            if (!body) 
				throw new ValidationError("No body")

			const { title, projectId, taskId, accountId } = JSON.parse(body)
            if (!title || !projectId || !taskId || !accountId) {
				throw new ValidationError("Missing required body params")
			}

			const taskExecution: TaskExecution = await startTaskExecutionUseCase.execute(title, projectId, taskId, accountId)
            const taskExecutionDTO: TaskExecutionDTO = TaskExecutionMapper.toDTO(taskExecution)
			return Responses._201(taskExecutionDTO)
		} catch (error) {
			console.error("Error starting task execution:", error)
			return errorHandler(error)
		}
	}
}