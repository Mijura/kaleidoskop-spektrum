import { APIGatewayProxyEvent } from "aws-lambda"
import { describe, it, expect, beforeEach } from "@rstest/core"
import { StartTaskExecution } from "@application/ports/use-cases/start-task-execution"
import { createStartTaskExecutionHandler } from "@infrastructure/http/factories/start-task-execution"
import { TaskExecution } from "@domain/task-execution"
import { TaskExecutionStatus } from "@domain/task-execution-status"

describe("Start Task Execution Handler", () => {
	let handler: (event: APIGatewayProxyEvent) => Promise<any>

	beforeEach(() => {
		// Reset handler before each test
		handler = undefined as any
	})

	it("returns 201 and task execution data when all required fields are provided", async () => {
		const mockTaskExecution = new TaskExecution(
			"test-execution-id",
			"Test Task",
			"project-123",
			"task-456",
			"account-789",
			TaskExecutionStatus.RUNNING,
			"2024-01-01T00:00:00.000Z",
		)

		const mockUseCase: StartTaskExecution = {
			execute: async () => mockTaskExecution,
		}

		handler = createStartTaskExecutionHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				title: "Test Task",
				projectId: "project-123",
				taskId: "task-456",
				accountId: "account-789",
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(201)

		const body = JSON.parse(result.body)

		expect(body.id).toBe("test-execution-id")
		expect(body.title).toBe("Test Task")
		expect(body.projectId).toBe("project-123")
		expect(body.taskId).toBe("task-456")
		expect(body.accountId).toBe("account-789")
		expect(body.status).toBe(TaskExecutionStatus.RUNNING)
	})

	it("returns 400 when body is missing", async () => {
		const mockUseCase: StartTaskExecution = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createStartTaskExecutionHandler(mockUseCase)

		const event = {} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("No body")
	})

	it("returns 400 when title is missing from body", async () => {
		const mockUseCase: StartTaskExecution = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createStartTaskExecutionHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				projectId: "project-123",
				taskId: "task-456",
				accountId: "account-789",
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Missing required body params")
	})

	it("returns 400 when projectId is missing from body", async () => {
		const mockUseCase: StartTaskExecution = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createStartTaskExecutionHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				title: "Test Task",
				taskId: "task-456",
				accountId: "account-789",
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Missing required body params")
	})

	it("returns 400 when taskId is missing from body", async () => {
		const mockUseCase: StartTaskExecution = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createStartTaskExecutionHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				title: "Test Task",
				projectId: "project-123",
				accountId: "account-789",
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Missing required body params")
	})

	it("returns 400 when accountId is missing from body", async () => {
		const mockUseCase: StartTaskExecution = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createStartTaskExecutionHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				title: "Test Task",
				projectId: "project-123",
				taskId: "task-456",
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Missing required body params")
	})

	it("returns 500 when an unexpected error is thrown", async () => {
		const mockUseCase: StartTaskExecution = {
			execute: async () => {
				throw new Error("Unexpected error")
			},
		}

		handler = createStartTaskExecutionHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				title: "Test Task",
				projectId: "project-123",
				taskId: "task-456",
				accountId: "account-789",
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(500)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Something went wrong")
	})
})
