import { HeatmapDTO } from "@application/dto/heatmap"
import { GetExecutionHeatmap } from "@application/ports/use-cases/get-execution-heatmap"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"


export function createGetExecutionHeatmapHandler(getExecutionHeatmapUseCase: GetExecutionHeatmap) {

    return async function getExecutionHeatmapHandler( event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
        try {
    
            const qs = event.queryStringParameters || {}
    
            const accountId = qs.accountId
            const startDate = qs.startDate
            const endDate = qs.endDate
    
            if (!accountId || !startDate || !endDate) {
                throw new ValidationError("Missing required query param")
            }
    
            try {
                const heatmap: HeatmapDTO[] = await getExecutionHeatmapUseCase.execute(accountId, { startDate, endDate })
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
}
