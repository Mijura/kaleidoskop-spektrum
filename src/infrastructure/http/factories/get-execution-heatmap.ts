import { HeatmapDTO } from "@application/dto/heatmap"
import { TimeRangeDTO } from "@application/dto/time-range"
import { GetExecutionHeatmap } from "@application/ports/use-cases/get-execution-heatmap"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

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

			const timeRange: TimeRangeDTO = {
				startDate: new Date(startDate).toISOString(),
				endDate: new Date(endDate).toISOString(),
			}

			const heatmap: HeatmapDTO[] = await getExecutionHeatmapUseCase.execute(accountId, timeRange)
			return Responses._200(heatmap)
		} catch (error) {
			console.error("Error fetching heatmap:", error)
			return errorHandler(error)
		}
	}
}
