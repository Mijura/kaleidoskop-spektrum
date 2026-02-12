import { FinishExecutionWithErrorUseCase } from "@application/ports/use-cases/finish-execution-with-error"
import { errorHandler, Responses, ValidationError } from "@jigjoy-ai/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export function createFinishExecutionWithErrorHandler(finishExecutionWithErrorUseCase: FinishExecutionWithErrorUseCase) {
	return async function finishExecutionWithErrorHandler({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		try {

            if (!body) 
				throw new ValidationError("No body")

			const { taskExecutionId, error } = JSON.parse(body)

            if (!taskExecutionId || !error) {
				throw new ValidationError("Missing required body params")
			}

			await finishExecutionWithErrorUseCase.execute(taskExecutionId, error)
			return Responses._200()

		} catch (error) {
			console.error("Error finishing execution with error:", error)
			return errorHandler(error)
		}
	}
}