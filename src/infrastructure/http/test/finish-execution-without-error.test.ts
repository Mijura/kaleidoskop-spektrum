import { APIGatewayProxyEvent } from "aws-lambda"
import { describe, it, expect, beforeEach } from "@rstest/core"
import { FinishExecutionWithoutError } from "@application/ports/use-cases/finish-execution-without-error"
import { createFinishExecutionWithoutErrorHandler } from "@infrastructure/http/factories/finish-execution-without-error"

describe("Finish Execution Without Error Handler", () => {
	let handler: (event: APIGatewayProxyEvent) => Promise<any>

	beforeEach(() => {
		// Reset handler before each test
		handler = undefined as any
	})

	it("returns 200 when taskExecutionId is provided", async () => {
		const mockUseCase: FinishExecutionWithoutError = {
			execute: async () => {},
		}

		handler = createFinishExecutionWithoutErrorHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				taskExecutionId: "test-execution-id",
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(200)
	})

	it("returns 400 when body is missing", async () => {
		const mockUseCase: FinishExecutionWithoutError = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createFinishExecutionWithoutErrorHandler(mockUseCase)

		const event = {} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("No body")
	})

	it("returns 400 when taskExecutionId is missing from body", async () => {
		const mockUseCase: FinishExecutionWithoutError = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createFinishExecutionWithoutErrorHandler(mockUseCase)

		const event = {
			body: JSON.stringify({}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Missing required body params")
	})

	it("returns 500 when an unexpected error is thrown", async () => {
		const mockUseCase: FinishExecutionWithoutError = {
			execute: async () => {
				throw new Error("Unexpected error")
			},
		}

		handler = createFinishExecutionWithoutErrorHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				taskExecutionId: "test-execution-id",
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(500)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Something went wrong")
	})
})
