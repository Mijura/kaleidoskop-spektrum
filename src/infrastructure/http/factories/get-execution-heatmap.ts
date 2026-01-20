import { GetExecutionHeatmapUseCase } from "@application/ports/use-cases/get-execution-heatmap"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { TimeRange } from "@application/value-objects/time-range"
import { Heatmap } from "@application/value-objects/heatmap"

export function createGetExecutionHeatmapHandler(getExecutionHeatmapUseCase: GetExecutionHeatmapUseCase) {
	return async function getExecutionHeatmapHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		try {

            const accountId = event.pathParameters?.accountId
			if (!accountId) {
				throw new ValidationError("Missing required path param: accountId")
			}

            const qs = event.queryStringParameters || {}
			const startDate = qs.startDate
			const endDate = qs.endDate

			if (!startDate || !endDate) {
				throw new ValidationError("Missing required query param")
			}

			const timeRange: TimeRange = {
				startDate: new Date(startDate).toISOString(),
				endDate: new Date(endDate).toISOString(),
			}

			const heatmap: Heatmap[] = await getExecutionHeatmapUseCase.execute(accountId, timeRange)
			return Responses._200(heatmap)
		} catch (error) {
			console.error("Error fetching heatmap:", error)
			return errorHandler(error)
		}
	}
}
