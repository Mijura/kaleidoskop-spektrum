import { GetExecutionHeatmap } from "@application/ports/use-cases/get-execution-heatmap"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { TimeRange } from "@application/value-objects/time-range"
import { Heatmap } from "@application/value-objects/heatmap"

export function createGetExecutionHeatmapHandler(getExecutionHeatmapUseCase: GetExecutionHeatmap) {
	return async function getExecutionHeatmapHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		try {
			const qs = event.queryStringParameters || {}

			const accountId = qs.accountId
			const startDate = qs.startDate
			const endDate = qs.endDate

			if (!accountId || !startDate || !endDate) {
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
