import { APIGatewayProxyEvent } from "aws-lambda"
import { describe, it, expect, beforeEach } from "@rstest/core"
import { GetExecutionHeatmap } from "@application/ports/use-cases/get-execution-heatmap"
import { createGetExecutionHeatmapHandler } from "@infrastructure/http/factories/get-execution-heatmap"
import { Heatmap } from "@application/value-objects/heatmap"

describe("Get Execution Heatmap Handler", () => {
	let handler: (event: APIGatewayProxyEvent) => Promise<any>

	beforeEach(() => {
		// Reset handler before each test
		handler = undefined as any
	})

	it("returns 200 and heatmap data when accountId, startDate, and endDate are provided", async () => {
		const mockHeatmap: Heatmap[] = [
			{ date: "2024-01-01T00:00:00.000Z", runCount: 5 },
			{ date: "2024-01-02T00:00:00.000Z", runCount: 10 },
		]

		const mockUseCase: GetExecutionHeatmap = {
			execute: async () => mockHeatmap,
		}

		handler = createGetExecutionHeatmapHandler(mockUseCase)

		const event = {
			pathParameters: {
				accountId: "account-789",
			},
			queryStringParameters: {
				startDate: "2024-01-01",
				endDate: "2024-01-02",
			},
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(200)

		const body = JSON.parse(result.body)

		expect(Array.isArray(body)).toBe(true)
		expect(body.length).toBe(2)
		expect(body[0].date).toBe("2024-01-01T00:00:00.000Z")
		expect(body[0].runCount).toBe(5)
		expect(body[1].date).toBe("2024-01-02T00:00:00.000Z")
		expect(body[1].runCount).toBe(10)
	})

	it("returns 400 when accountId is missing from path parameters", async () => {
		const mockUseCase: GetExecutionHeatmap = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createGetExecutionHeatmapHandler(mockUseCase)

		const event = {
			pathParameters: {},
			queryStringParameters: {
				startDate: "2024-01-01",
				endDate: "2024-01-02",
			},
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Missing required path param: accountId")
	})

	it("returns 400 when startDate is missing from query parameters", async () => {
		const mockUseCase: GetExecutionHeatmap = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createGetExecutionHeatmapHandler(mockUseCase)

		const event = {
			pathParameters: {
				accountId: "account-789",
			},
			queryStringParameters: {
				endDate: "2024-01-02",
			},
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Missing required query param")
	})

	it("returns 400 when endDate is missing from query parameters", async () => {
		const mockUseCase: GetExecutionHeatmap = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createGetExecutionHeatmapHandler(mockUseCase)

		const event = {
			pathParameters: {
				accountId: "account-789",
			},
			queryStringParameters: {
				startDate: "2024-01-01",
			},
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Missing required query param")
	})

	it("returns 400 when queryStringParameters is null", async () => {
		const mockUseCase: GetExecutionHeatmap = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createGetExecutionHeatmapHandler(mockUseCase)

		const event = {
			pathParameters: {
				accountId: "account-789",
			},
			queryStringParameters: null,
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Missing required query param")
	})

	it("returns 400 when queryStringParameters is undefined", async () => {
		const mockUseCase: GetExecutionHeatmap = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createGetExecutionHeatmapHandler(mockUseCase)

		const event = {
			pathParameters: {
				accountId: "account-789",
			},
			queryStringParameters: undefined,
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Missing required query param")
	})

	it("returns 500 when an unexpected error is thrown", async () => {
		const mockUseCase: GetExecutionHeatmap = {
			execute: async () => {
				throw new Error("Unexpected error")
			},
		}

		handler = createGetExecutionHeatmapHandler(mockUseCase)

		const event = {
			pathParameters: {
				accountId: "account-789",
			},
			queryStringParameters: {
				startDate: "2024-01-01",
				endDate: "2024-01-02",
			},
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(500)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Something went wrong")
	})
})
