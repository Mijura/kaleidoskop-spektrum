import { describe, it, expect, beforeEach } from "@rstest/core"
import { GetExecutionHeatmapUseCase } from "@application/use-cases/get-execution-heatmap"
import { InMemoryTaskExecutionRepository } from "@application/test/mocks/in-memory-task-execution-repository"
import { TaskExecutionRepository } from "@application/ports/repositories/task-execution-repository"
import { TaskExecution } from "@domain/task-execution"
import { TimeRange } from "@application/value-objects/time-range"

describe("Get Execution Heatmap", () => {
	let getExecutionHeatmapUseCase: GetExecutionHeatmapUseCase
	let repository: TaskExecutionRepository

	beforeEach(() => {
		repository = new InMemoryTaskExecutionRepository()
		getExecutionHeatmapUseCase = new GetExecutionHeatmapUseCase(repository)
	})

	it("should return heatmap data for account executions within time range", async () => {
		// Arrange
		const accountId = "account-123"
		const startDate = new Date("2024-01-01")
		const endDate = new Date("2024-01-03")

		// Create executions on different dates
		const execution1 = TaskExecution.create("Task 1", "project-1", "task-1", accountId)
		execution1.occurredAt = new Date("2024-01-01T10:00:00Z").toISOString()
		await repository.save(execution1)

		const execution2 = TaskExecution.create("Task 2", "project-2", "task-2", accountId)
		execution2.occurredAt = new Date("2024-01-01T15:00:00Z").toISOString()
		await repository.save(execution2)

		const execution3 = TaskExecution.create("Task 3", "project-3", "task-3", accountId)
		execution3.occurredAt = new Date("2024-01-02T10:00:00Z").toISOString()
		await repository.save(execution3)

		const timeRange: TimeRange = {
			startDate: startDate.toISOString(),
			endDate: endDate.toISOString(),
		}

		// Act
		const result = await getExecutionHeatmapUseCase.execute(accountId, timeRange)

		// Assert
		expect(result).toBeDefined()
		expect(Array.isArray(result)).toBe(true)
		expect(result.length).toBe(3) // 3 days in range

		const date1Entry = result.find((h) => h.date === "2024-01-01")
		const date2Entry = result.find((h) => h.date === "2024-01-02")
		const date3Entry = result.find((h) => h.date === "2024-01-03")

		expect(date1Entry).toBeDefined()
		expect(date1Entry?.runCount).toBe(2)
		expect(date2Entry).toBeDefined()
		expect(date2Entry?.runCount).toBe(1)
		expect(date3Entry).toBeDefined()
		expect(date3Entry?.runCount).toBe(0)
	})

	it("should return empty heatmap when account has no executions", async () => {
		// Arrange
		const accountId = "account-123"
		const otherAccountId = "account-456"

		const execution = TaskExecution.create("Task 1", "project-1", "task-1", otherAccountId)
		execution.occurredAt = new Date("2024-01-01T10:00:00Z").toISOString()
		await repository.save(execution)

		const timeRange: TimeRange = {
			startDate: new Date("2024-01-01").toISOString(),
			endDate: new Date("2024-01-03").toISOString(),
		}

		// Act
		const result = await getExecutionHeatmapUseCase.execute(accountId, timeRange)

		// Assert
		expect(result).toBeDefined()
		expect(result.length).toBe(3) // 3 days in range
		expect(result.every((h) => h.runCount === 0)).toBe(true)
	})

	it("should exclude executions outside time range", async () => {
		// Arrange
		const accountId = "account-123"

		const execution1 = TaskExecution.create("Task 1", "project-1", "task-1", accountId)
		execution1.occurredAt = new Date("2023-12-31T10:00:00Z").toISOString()
		await repository.save(execution1)

		const execution2 = TaskExecution.create("Task 2", "project-2", "task-2", accountId)
		execution2.occurredAt = new Date("2024-01-01T10:00:00Z").toISOString()
		await repository.save(execution2)

		const execution3 = TaskExecution.create("Task 3", "project-3", "task-3", accountId)
		execution3.occurredAt = new Date("2024-01-04T10:00:00Z").toISOString()
		await repository.save(execution3)

		const timeRange: TimeRange = {
			startDate: new Date("2024-01-01").toISOString(),
			endDate: new Date("2024-01-03").toISOString(),
		}

		// Act
		const result = await getExecutionHeatmapUseCase.execute(accountId, timeRange)

		// Assert
		const date1Entry = result.find((h) => h.date === "2024-01-01")
		expect(date1Entry?.runCount).toBe(1)
		expect(result.every((h) => h.runCount <= 1)).toBe(true)
	})

	it("should return all dates in range even with zero executions", async () => {
		// Arrange
		const accountId = "account-123"

		const timeRange: TimeRange = {
			startDate: new Date("2024-01-01").toISOString(),
			endDate: new Date("2024-01-05").toISOString(),
		}

		// Act
		const result = await getExecutionHeatmapUseCase.execute(accountId, timeRange)

		// Assert
		expect(result).toBeDefined()
		expect(result.length).toBe(5) // 5 days in range
		expect(result[0].date).toBe("2024-01-01")
		expect(result[1].date).toBe("2024-01-02")
		expect(result[2].date).toBe("2024-01-03")
		expect(result[3].date).toBe("2024-01-04")
		expect(result[4].date).toBe("2024-01-05")
		expect(result.every((h) => h.runCount === 0)).toBe(true)
	})

	it("should return results sorted by date ascending", async () => {
		// Arrange
		const accountId = "account-123"

		const execution1 = TaskExecution.create("Task 1", "project-1", "task-1", accountId)
		execution1.occurredAt = new Date("2024-01-03T10:00:00Z").toISOString()
		await repository.save(execution1)

		const execution2 = TaskExecution.create("Task 2", "project-2", "task-2", accountId)
		execution2.occurredAt = new Date("2024-01-01T10:00:00Z").toISOString()
		await repository.save(execution2)

		const execution3 = TaskExecution.create("Task 3", "project-3", "task-3", accountId)
		execution3.occurredAt = new Date("2024-01-02T10:00:00Z").toISOString()
		await repository.save(execution3)

		const timeRange: TimeRange = {
			startDate: new Date("2024-01-01").toISOString(),
			endDate: new Date("2024-01-03").toISOString(),
		}

		// Act
		const result = await getExecutionHeatmapUseCase.execute(accountId, timeRange)

		// Assert
		expect(result.length).toBe(3)
		expect(result[0].date).toBe("2024-01-01")
		expect(result[1].date).toBe("2024-01-02")
		expect(result[2].date).toBe("2024-01-03")
	})

	it("should count multiple executions on the same date", async () => {
		// Arrange
		const accountId = "account-123"

		// Create multiple executions on the same date
		for (let i = 0; i < 5; i++) {
			const execution = TaskExecution.create(`Task ${i}`, `project-${i}`, `task-${i}`, accountId)
			execution.occurredAt = new Date("2024-01-01T10:00:00Z").toISOString()
			await repository.save(execution)
		}

		const timeRange: TimeRange = {
			startDate: new Date("2024-01-01T00:00:00Z").toISOString(),
			endDate: new Date("2024-01-01T23:59:59Z").toISOString(),
		}

		// Act
		const result = await getExecutionHeatmapUseCase.execute(accountId, timeRange)

		// Assert
		expect(result.length).toBe(1)
		expect(result[0].date).toBe("2024-01-01")
		expect(result[0].runCount).toBe(5)
	})
})
