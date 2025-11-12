import { TaskExecution } from "@domain/entities/task-execution"
import { fetchTimelineByAccountId } from "@infrastructure/dependencies"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export async function fetchAccountTimelineHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	try {
        const qs = event.queryStringParameters || {}

        const accountId = qs.accountId
        const pageNumber = qs.page ? parseInt(qs.page, 10) : 1
        const pageSize = qs.size ? parseInt(qs.size, 10) : 25

        if (!accountId) {
            throw new ValidationError("Missing required query param: projectId")
        }

        if (Number.isNaN(pageNumber) || Number.isNaN(pageSize)) {
            throw new ValidationError("Invalid page or size query params")
        }
		
        const pagination = {
            pageNumber: pageNumber,
            pageSize: pageSize
        }

        try {
            const activities: TaskExecution[] = await fetchTimelineByAccountId.execute(accountId, pagination)
            return Responses._200(activities)
		} catch (error) {
			// TODO: Handle Project Not Found
			console.error("Error fetching project timeline:", error)
			throw new Error(`Error fetching project timeline.`)
		}

	} catch (error) {
		return errorHandler(error)
	}
}