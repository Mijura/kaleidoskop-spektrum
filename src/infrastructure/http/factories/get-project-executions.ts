import { PaginationDTO } from "@application/dto/pagination"
import { TaskExecutionDTO } from "@application/dto/task-execution"
import { GetProjectExecutions } from "@application/ports/use-cases/get-project-executions"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export function createGetProjectExecutionsHandler(getProjectExecutionsUseCase: GetProjectExecutions) {

    return async function getProjectExecutionsHandler( event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
        try {
    
            const qs = event.queryStringParameters || {}
    
            const projectId = qs.projectId
            const pageNumber = qs.page ? parseInt(qs.page, 10) : 1
            const pageSize = qs.size ? parseInt(qs.size, 10) : 25
    
            if (!projectId) {
                throw new ValidationError("Missing required query param: projectId")
            }
    
            if (Number.isNaN(pageNumber) || Number.isNaN(pageSize)) {
                throw new ValidationError("Invalid page or size query params")
            }
            
            const pagination: PaginationDTO = {
                pageNumber: pageNumber,
                pageSize: pageSize
            }
    
            const activities: TaskExecutionDTO[] = await getProjectExecutionsUseCase.execute(projectId, pagination)
            return Responses._200(activities)
    
        } catch (error) {
            console.error("Error fetching project timeline:", error)
            return errorHandler(error)
        }
    }
}