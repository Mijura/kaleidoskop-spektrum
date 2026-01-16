import { describe, it, expect, beforeEach } from "@rstest/core"
import { GetProjectExecutionsUseCase } from "@application/use-cases/get-project-executions"
import { InMemoryTaskExecutionRepository } from "@application/test/mocks/in-memory-task-execution-repository"
import { TaskExecutionRepository } from "@application/ports/repositories/task-execution-repository"
import { TaskExecution } from "@domain/task-execution"
import { Pagination } from "@application/value-objects/pagination"

describe("Get Project Executions", () => {
	let getProjectExecutionsUseCase: GetProjectExecutionsUseCase
	let repository: TaskExecutionRepository

	beforeEach(() => {
		repository = new InMemoryTaskExecutionRepository()
		getProjectExecutionsUseCase = new GetProjectExecutionsUseCase(repository)
	})

	it("should return task executions for a specific project", async () => {
		// Arrange
		const projectId = "project-123"
		const otherProjectId = "project-456"

		const execution1 = TaskExecution.create("Task 1", projectId, "task-1", "account-1")
		const execution2 = TaskExecution.create("Task 2", projectId, "task-2", "account-1")
		const execution3 = TaskExecution.create("Task 3", otherProjectId, "task-3", "account-1")

		await repository.save(execution1)
		await repository.save(execution2)
		await repository.save(execution3)

		const pagination: Pagination = {
			pageNumber: 1,
			pageSize: 10,
		}

		// Act
		const result = await getProjectExecutionsUseCase.execute(projectId, pagination)

		// Assert
		expect(result).toBeDefined()
		expect(result.length).toBe(2)
		expect(result.some((e) => e.id === execution1.id)).toBe(true)
		expect(result.some((e) => e.id === execution2.id)).toBe(true)
		expect(result.some((e) => e.id === execution3.id)).toBe(false)
	})

	it("should return empty array when project has no executions", async () => {
		// Arrange
		const projectId = "project-123"
		const otherProjectId = "project-456"

		const execution = TaskExecution.create("Task 1", otherProjectId, "task-1", "account-1")
		await repository.save(execution)

		const pagination: Pagination = {
			pageNumber: 1,
			pageSize: 10,
		}

		// Act
		const result = await getProjectExecutionsUseCase.execute(projectId, pagination)

		// Assert
		expect(result).toBeDefined()
		expect(result.length).toBe(0)
	})

	it("should return paginated results", async () => {
		// Arrange
		const projectId = "project-123"

		// Create multiple executions
		for (let i = 0; i < 5; i++) {
			const execution = TaskExecution.create(`Task ${i}`, projectId, `task-${i}`, "account-1")
			await repository.save(execution)
			// Add small delay to ensure different timestamps
			await new Promise((resolve) => setTimeout(resolve, 10))
		}

		const pagination: Pagination = {
			pageNumber: 1,
			pageSize: 2,
		}

		// Act
		const result = await getProjectExecutionsUseCase.execute(projectId, pagination)

		// Assert
		expect(result).toBeDefined()
		expect(result.length).toBe(2)
	})

	it("should return results sorted by occurredAt descending", async () => {
		// Arrange
		const projectId = "project-123"

		const execution1 = TaskExecution.create("Task 1", projectId, "task-1", "account-1")
		await repository.save(execution1)
		await new Promise((resolve) => setTimeout(resolve, 10))

		const execution2 = TaskExecution.create("Task 2", projectId, "task-2", "account-1")
		await repository.save(execution2)
		await new Promise((resolve) => setTimeout(resolve, 10))

		const execution3 = TaskExecution.create("Task 3", projectId, "task-3", "account-1")
		await repository.save(execution3)

		const pagination: Pagination = {
			pageNumber: 1,
			pageSize: 10,
		}

		// Act
		const result = await getProjectExecutionsUseCase.execute(projectId, pagination)

		// Assert
		expect(result.length).toBe(3)
		expect(result[0].id).toBe(execution3.id)
		expect(result[1].id).toBe(execution2.id)
		expect(result[2].id).toBe(execution1.id)
	})

	it("should handle pagination correctly for second page", async () => {
		// Arrange
		const projectId = "project-123"

		// Create multiple executions
		for (let i = 0; i < 5; i++) {
			const execution = TaskExecution.create(`Task ${i}`, projectId, `task-${i}`, "account-1")
			await repository.save(execution)
			await new Promise((resolve) => setTimeout(resolve, 10))
		}

		const pagination: Pagination = {
			pageNumber: 2,
			pageSize: 2,
		}

		// Act
		const result = await getProjectExecutionsUseCase.execute(projectId, pagination)

		// Assert
		expect(result).toBeDefined()
		expect(result.length).toBe(2)
	})
})
