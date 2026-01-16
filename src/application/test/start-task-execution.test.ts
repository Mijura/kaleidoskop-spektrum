import { describe, it, expect, beforeEach } from "@rstest/core"
import { StartTaskExecution } from "@application/use-cases/start-task-execution"
import { InMemoryTaskExecutionRepository } from "@application/test/mocks/in-memory-task-execution-repository"
import { TaskExecutionRepository } from "@application/ports/repositories/task-execution-repository"
import { TaskExecution } from "@domain/task-execution"
import { TaskExecutionStatus } from "@domain/task-execution-status"

describe("Start Task Execution", () => {
	let startTaskExecutionUseCase: StartTaskExecution
	let repository: TaskExecutionRepository

	beforeEach(() => {
		repository = new InMemoryTaskExecutionRepository()
		startTaskExecutionUseCase = new StartTaskExecution(repository)
	})

	it("should successfully create a task execution", async () => {
		// Arrange
		const title = "Test Task"
		const projectId = "project-123"
		const taskId = "task-456"
		const accountId = "account-789"

		// Act
		const result = await startTaskExecutionUseCase.execute(title, projectId, taskId, accountId)

		// Assert
		expect(result).toBeDefined()
		expect(result).toBeInstanceOf(TaskExecution)
		expect(result.title).toBe(title)
		expect(result.projectId).toBe(projectId)
		expect(result.taskId).toBe(taskId)
		expect(result.accountId).toBe(accountId)
		expect(result.status).toBe(TaskExecutionStatus.RUNNING)
		expect(result.id).toBeDefined()
		expect(result.occurredAt).toBeDefined()
	})

	it("should save the task execution to repository", async () => {
		// Arrange
		const title = "Test Task"
		const projectId = "project-123"
		const taskId = "task-456"
		const accountId = "account-789"

		// Act
		const result = await startTaskExecutionUseCase.execute(title, projectId, taskId, accountId)

		// Assert
		const savedExecution = await repository.get(result.id)
		expect(savedExecution).toBeDefined()
		expect(savedExecution?.id).toBe(result.id)
		expect(savedExecution?.title).toBe(title)
		expect(savedExecution?.projectId).toBe(projectId)
		expect(savedExecution?.taskId).toBe(taskId)
		expect(savedExecution?.accountId).toBe(accountId)
	})

	it("should create task execution with RUNNING status", async () => {
		// Arrange
		const title = "Test Task"
		const projectId = "project-123"
		const taskId = "task-456"
		const accountId = "account-789"

		// Act
		const result = await startTaskExecutionUseCase.execute(title, projectId, taskId, accountId)

		// Assert
		expect(result.status).toBe(TaskExecutionStatus.RUNNING)
	})

	it("should create task execution with valid ISO timestamp", async () => {
		// Arrange
		const title = "Test Task"
		const projectId = "project-123"
		const taskId = "task-456"
		const accountId = "account-789"

		// Act
		const result = await startTaskExecutionUseCase.execute(title, projectId, taskId, accountId)

		// Assert
		const occurredAtDate = new Date(result.occurredAt)
		expect(occurredAtDate.getTime()).not.toBeNaN()
		expect(result.occurredAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
	})

	it("should create different task executions with different IDs", async () => {
		// Arrange
		const title = "Test Task"
		const projectId = "project-123"
		const taskId = "task-456"
		const accountId = "account-789"

		// Act
		const result1 = await startTaskExecutionUseCase.execute(title, projectId, taskId, accountId)
		const result2 = await startTaskExecutionUseCase.execute(title, projectId, taskId, accountId)

		// Assert
		expect(result1.id).not.toBe(result2.id)
	})
})
