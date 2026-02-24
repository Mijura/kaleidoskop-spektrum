import { StartTaskExecutionUseCase, StartTaskExecutionUseCaseParams } from "@application/ports/use-cases/start-task-execution"
import { TaskExecutionDTO } from "@infrastructure/http/dto/task-execution"
import { TaskExecution } from "@domain/task-execution"
import { errorHandler, Responses, ValidationError } from "@jigjoy-ai/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { TaskExecutionMapper } from "@infrastructure/http/mappers/task-execution"
import { Auth } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"
import { extractAuthData } from "@heksagon/http"

export function createStartTaskExecutionHandler(startTaskExecutionUseCase: StartTaskExecutionUseCase) {
	return async function startTaskExecutionHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		try {
			if (!event.body) throw new ValidationError("No body")

            if (!event.body) 
				throw new ValidationError("No body")

			const { title, projectId, taskId, accountId } = JSON.parse(event.body)
            if (!title || !projectId || !taskId || !accountId) {
				throw new ValidationError("Missing required body params")
			}

			const auth: Auth<UserData> = extractAuthData(event.headers)

			const params: StartTaskExecutionUseCaseParams = {
				title,
				projectId,
				taskId,
			}
			const taskExecution: TaskExecution = await startTaskExecutionUseCase.execute(auth, params)
            const taskExecutionDTO: TaskExecutionDTO = TaskExecutionMapper.toDTO(taskExecution)

			return Responses._201(taskExecutionDTO)
		} catch (error) {
			console.error("Error starting task execution:", error)
			return errorHandler(error)
		}
	}
}
