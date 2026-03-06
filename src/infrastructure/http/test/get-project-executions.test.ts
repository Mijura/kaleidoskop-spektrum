import { APIGatewayProxyEvent } from "aws-lambda"
import { describe, it, expect, beforeEach } from "@rstest/core"
import { GetProjectExecutions } from "@application/ports/use-cases/get-project-executions"
import { createGetProjectExecutionsHandler } from "@infrastructure/http/factories/get-project-executions"
import { TaskExecution } from "@domain/task-execution"
import { TaskExecutionStatus } from "@domain/task-execution-status"

describe("Get Project Executions Handler", () => {
	let handler: (event: APIGatewayProxyEvent) => Promise<any>

	beforeEach(() => {
		// Reset handler before each test
		handler = undefined as any
	})

	it("returns 200 and task executions data when projectId is provided", async () => {
		const mockTaskExecution = new TaskExecution(
			"test-execution-id",
			"Test Task",
			"project-123",
			"task-456",
			"account-789",
			TaskExecutionStatus.RUNNING,
			"2024-01-01T00:00:00.000Z",
		)

		const mockUseCase: GetProjectExecutions = {
			execute: async () => [mockTaskExecution],
		}

		handler = createGetProjectExecutionsHandler(mockUseCase)

		const event = {
			pathParameters: {
				projectId: "project-123",
			},
			queryStringParameters: {
				page: "1",
				size: "25",
			},
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(200)

		const body = JSON.parse(result.body)

		expect(Array.isArray(body)).toBe(true)
		expect(body.length).toBe(1)
		expect(body[0].id).toBe("test-execution-id")
		expect(body[0].title).toBe("Test Task")
		expect(body[0].projectId).toBe("project-123")
		expect(body[0].taskId).toBe("task-456")
		expect(body[0].accountId).toBe("account-789")
		expect(body[0].status).toBe(TaskExecutionStatus.RUNNING)
	})

	it("returns 200 with default pagination when query params are not provided", async () => {
		const mockUseCase: GetProjectExecutions = {
			execute: async () => [],
		}

		handler = createGetProjectExecutionsHandler(mockUseCase)

		const event = {
			pathParameters: {
				projectId: "project-123",
			},
			queryStringParameters: {},
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(200)
	})

	it("returns 200 with default pagination when queryStringParameters is null", async () => {
		const mockUseCase: GetProjectExecutions = {
			execute: async () => [],
		}

		handler = createGetProjectExecutionsHandler(mockUseCase)

		const event = {
			pathParameters: {
				projectId: "project-123",
			},
			queryStringParameters: null,
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(200)
	})

	it("returns 200 with default pagination when queryStringParameters is undefined", async () => {
		const mockUseCase: GetProjectExecutions = {
			execute: async () => [],
		}

		handler = createGetProjectExecutionsHandler(mockUseCase)

		const event = {
			pathParameters: {
				projectId: "project-123",
			},
			queryStringParameters: undefined,
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(200)
	})

	it("returns 400 when projectId is missing from path parameters", async () => {
		const mockUseCase: GetProjectExecutions = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createGetProjectExecutionsHandler(mockUseCase)

		const event = {
			pathParameters: {},
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Missing required path param: projectId")
	})

	it("returns 400 when page query param is invalid", async () => {
		const mockUseCase: GetProjectExecutions = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createGetProjectExecutionsHandler(mockUseCase)

		const event = {
			pathParameters: {
				projectId: "project-123",
			},
			queryStringParameters: {
				page: "invalid",
				size: "25",
			},
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Invalid page or size query params")
	})

	it("returns 400 when size query param is invalid", async () => {
		const mockUseCase: GetProjectExecutions = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createGetProjectExecutionsHandler(mockUseCase)

		const event = {
			pathParameters: {
				projectId: "project-123",
			},
			queryStringParameters: {
				page: "1",
				size: "invalid",
			},
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Invalid page or size query params")
	})

	it("returns 500 when an unexpected error is thrown", async () => {
		const mockUseCase: GetProjectExecutions = {
			execute: async () => {
				throw new Error("Unexpected error")
			},
		}

		handler = createGetProjectExecutionsHandler(mockUseCase)

		const event = {
			pathParameters: {
				projectId: "project-123",
			},
			queryStringParameters: {
				page: "1",
				size: "25",
			},
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(500)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Something went wrong")
	})
})
