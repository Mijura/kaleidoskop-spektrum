import { describe, it, expect, beforeEach } from "@rstest/core"
import { GetAccountExecutions } from "@application/use-cases/get-account-executions"
import { InMemoryTaskExecutionRepository } from "@application/test/mocks/in-memory-task-execution-repository"
import { TaskExecutionRepository } from "@application/ports/repositories/task-execution-repository"
import { TaskExecution } from "@domain/task-execution"
import { Pagination } from "@application/value-objects/pagination"

describe("Get Account Executions", () => {
	let getAccountExecutionsUseCase: GetAccountExecutions
	let repository: TaskExecutionRepository

	beforeEach(() => {
		repository = new InMemoryTaskExecutionRepository()
		getAccountExecutionsUseCase = new GetAccountExecutions(repository)
	})

	it("should return task executions for a specific account", async () => {
		// Arrange
		const accountId = "account-123"
		const otherAccountId = "account-456"

		const execution1 = TaskExecution.create("Task 1", "project-1", "task-1", accountId)
		const execution2 = TaskExecution.create("Task 2", "project-2", "task-2", accountId)
		const execution3 = TaskExecution.create("Task 3", "project-3", "task-3", otherAccountId)

		await repository.save(execution1)
		await repository.save(execution2)
		await repository.save(execution3)

		const pagination: Pagination = {
			pageNumber: 1,
			pageSize: 10,
		}

		// Act
		const result = await getAccountExecutionsUseCase.execute(accountId, pagination)

		// Assert
		expect(result).toBeDefined()
		expect(result.length).toBe(2)
		expect(result.some((e) => e.id === execution1.id)).toBe(true)
		expect(result.some((e) => e.id === execution2.id)).toBe(true)
		expect(result.some((e) => e.id === execution3.id)).toBe(false)
	})

	it("should return empty array when account has no executions", async () => {
		// Arrange
		const accountId = "account-123"
		const otherAccountId = "account-456"

		const execution = TaskExecution.create("Task 1", "project-1", "task-1", otherAccountId)
		await repository.save(execution)

		const pagination: Pagination = {
			pageNumber: 1,
			pageSize: 10,
		}

		// Act
		const result = await getAccountExecutionsUseCase.execute(accountId, pagination)

		// Assert
		expect(result).toBeDefined()
		expect(result.length).toBe(0)
	})

	it("should return paginated results", async () => {
		// Arrange
		const accountId = "account-123"

		// Create multiple executions
		for (let i = 0; i < 5; i++) {
			const execution = TaskExecution.create(`Task ${i}`, `project-${i}`, `task-${i}`, accountId)
			await repository.save(execution)
			// Add small delay to ensure different timestamps
			await new Promise((resolve) => setTimeout(resolve, 10))
		}

		const pagination: Pagination = {
			pageNumber: 1,
			pageSize: 2,
		}

		// Act
		const result = await getAccountExecutionsUseCase.execute(accountId, pagination)

		// Assert
		expect(result).toBeDefined()
		expect(result.length).toBe(2)
	})

	it("should return results sorted by occurredAt descending", async () => {
		// Arrange
		const accountId = "account-123"

		const execution1 = TaskExecution.create("Task 1", "project-1", "task-1", accountId)
		await repository.save(execution1)
		await new Promise((resolve) => setTimeout(resolve, 10))

		const execution2 = TaskExecution.create("Task 2", "project-2", "task-2", accountId)
		await repository.save(execution2)
		await new Promise((resolve) => setTimeout(resolve, 10))

		const execution3 = TaskExecution.create("Task 3", "project-3", "task-3", accountId)
		await repository.save(execution3)

		const pagination: Pagination = {
			pageNumber: 1,
			pageSize: 10,
		}

		// Act
		const result = await getAccountExecutionsUseCase.execute(accountId, pagination)

		// Assert
		expect(result.length).toBe(3)
		expect(result[0].id).toBe(execution3.id)
		expect(result[1].id).toBe(execution2.id)
		expect(result[2].id).toBe(execution1.id)
	})

	it("should handle pagination correctly for second page", async () => {
		// Arrange
		const accountId = "account-123"

		// Create multiple executions
		for (let i = 0; i < 5; i++) {
			const execution = TaskExecution.create(`Task ${i}`, `project-${i}`, `task-${i}`, accountId)
			await repository.save(execution)
			await new Promise((resolve) => setTimeout(resolve, 10))
		}

		const pagination: Pagination = {
			pageNumber: 2,
			pageSize: 2,
		}

		// Act
		const result = await getAccountExecutionsUseCase.execute(accountId, pagination)

		// Assert
		expect(result).toBeDefined()
		expect(result.length).toBe(2)
	})
})
