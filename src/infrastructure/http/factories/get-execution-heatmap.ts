import { GetExecutionHeatmapUseCase, GetExecutionHeatmapUseCaseParams } from "@application/ports/use-cases/get-execution-heatmap"
import { errorHandler, Responses, ValidationError } from "@jigjoy-ai/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { TimeRange } from "@application/value-objects/time-range"
import { Heatmap } from "@application/value-objects/heatmap"
import { Auth } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"
import { extractAuthData } from "@heksagon/http"

export function createGetExecutionHeatmapHandler(getExecutionHeatmapUseCase: GetExecutionHeatmapUseCase) {
	return async function getExecutionHeatmapHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		try {

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

			const auth: Auth<UserData> = extractAuthData(event.headers)

			const params: GetExecutionHeatmapUseCaseParams = {
				timeRange,
			}
			const heatmap: Heatmap[] = await getExecutionHeatmapUseCase.execute(auth, params)

			return Responses._200(heatmap)
		} catch (error) {
			console.error("Error fetching heatmap:", error)
			return errorHandler(error)
		}
	}
}
