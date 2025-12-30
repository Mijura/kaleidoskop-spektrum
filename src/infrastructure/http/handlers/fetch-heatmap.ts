import { HeatmapDTO } from "@application/dto/heatmap"
import { fetchTaskExecutionsHeatmap } from "@infrastructure/dependencies"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export async function fetchHeatmapHandler( event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	try {

        const qs = event.queryStringParameters || {}

        const accountId = qs.accountId
        const startDate = qs.startDate
        const endDate = qs.endDate

        if (!accountId || !startDate || !endDate) {
            throw new ValidationError("Missing required query param")
        }

        try {
            const heatmap: HeatmapDTO[] = await fetchTaskExecutionsHeatmap.execute(accountId, { startDate, endDate })
            return Responses._200(heatmap)
		} catch (error) {
			// TODO: Handle Project Not Found
			console.error("Error fetching heatmap:", error)
			throw new Error(`Error fetching heatmap.`)
		}

	} catch (error) {
		return errorHandler(error)
	}
}