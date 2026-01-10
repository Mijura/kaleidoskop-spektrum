import { FinishExecutionWithoutError } from "@application/ports/use-cases/finish-execution-without-error"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export function createFinishExecutionWithoutErrorHandler(finishExecutionWithoutErrorUseCase: FinishExecutionWithoutError) {
	return async function finishExecutionWithoutErrorHandler({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		try {
            if (!body) 
				throw new ValidationError("No body")
            
			const { taskExecutionId } = JSON.parse(body)
            if (!taskExecutionId) {
				throw new ValidationError("Missing required body params")
			}

			await finishExecutionWithoutErrorUseCase.execute(taskExecutionId)
			return Responses._200()

		} catch (error) {
			console.error("Error finishing execution without error:", error)
			return errorHandler(error)
		}
	}
}