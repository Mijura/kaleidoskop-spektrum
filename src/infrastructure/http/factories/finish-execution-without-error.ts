import { FinishExecutionWithoutErrorUseCase, FinishExecutionWithoutErrorUseCaseParams } from "@application/ports/use-cases/finish-execution-without-error"
import { Auth } from "@heksagon/app"
import { extractAuthData } from "@heksagon/http"
import { UserData } from "@jigjoy-ai/auth"
import { errorHandler, Responses, ValidationError } from "@jigjoy-ai/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export function createFinishExecutionWithoutErrorHandler(finishExecutionWithoutErrorUseCase: FinishExecutionWithoutErrorUseCase) {
	return async function finishExecutionWithoutErrorHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		try {
            if (!event.body) 
				throw new ValidationError("No body")
            
			const { taskExecutionId } = JSON.parse(event.body)
            if (!taskExecutionId) {
				throw new ValidationError("Missing required body params")
			}

			const auth: Auth<UserData> = extractAuthData(event)

			const params: FinishExecutionWithoutErrorUseCaseParams = {
				taskExecutionId,
			}
			await finishExecutionWithoutErrorUseCase.execute(auth, params)
			return Responses._200()

		} catch (error) {
			console.error("Error finishing execution without error:", error)
			return errorHandler(error)
		}
	}
}