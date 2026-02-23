import { FinishExecutionWithErrorUseCase, FinishExecutionWithErrorUseCaseParams } from "@application/ports/use-cases/finish-execution-with-error"
import { Auth } from "@heksagon/app"
import { extractAuthData } from "@heksagon/http"
import { UserData } from "@jigjoy-ai/auth"
import { errorHandler, Responses, ValidationError } from "@jigjoy-ai/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export function createFinishExecutionWithErrorHandler(finishExecutionWithErrorUseCase: FinishExecutionWithErrorUseCase) {
	return async function finishExecutionWithErrorHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		try {

            if (!event.body) 
				throw new ValidationError("No body")

			const { taskExecutionId, error } = JSON.parse(event.body)

            if (!taskExecutionId || !error) {
				throw new ValidationError("Missing required body params")
			}

			const auth: Auth<UserData> = extractAuthData(event)

			const params: FinishExecutionWithErrorUseCaseParams = {
				taskExecutionId,
				error,
			}
			await finishExecutionWithErrorUseCase.execute(auth, params)
			return Responses._200()

		} catch (error) {
			console.error("Error finishing execution with error:", error)
			return errorHandler(error)
		}
	}
}