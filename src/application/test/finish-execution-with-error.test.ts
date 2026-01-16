import { describe, it, expect, beforeEach } from "@rstest/core"
import { FinishExecutionWithErrorUseCase } from "@application/use-cases/finish-execution-with-error"
import { InMemoryTaskExecutionRepository } from "@application/test/mocks/in-memory-task-execution-repository"
import { TaskExecutionRepository } from "@application/ports/repositories/task-execution-repository"
import { TaskExecution } from "@domain/task-execution"
import { TaskExecutionStatus } from "@domain/task-execution-status"

describe("Finish Execution With Error", () => {
	let finishExecutionWithErrorUseCase: FinishExecutionWithErrorUseCase
	let repository: TaskExecutionRepository

	beforeEach(() => {
		repository = new InMemoryTaskExecutionRepository()
		finishExecutionWithErrorUseCase = new FinishExecutionWithErrorUseCase(repository)
	})

	it("should successfully finish execution with error", async () => {
		// Arrange
		const taskExecution = TaskExecution.create("Test Task", "project-123", "task-456", "account-789")
		await repository.save(taskExecution)
		const errorMessage = "Something went wrong"

		// Act
		await finishExecutionWithErrorUseCase.execute(taskExecution.id, errorMessage)

		// Assert
		const updatedExecution = await repository.get(taskExecution.id)
		expect(updatedExecution).toBeDefined()
		expect(updatedExecution?.status).toBe(TaskExecutionStatus.FAILED)
		expect(updatedExecution?.error).toBe(errorMessage)
	})

	it("should save the updated task execution to repository", async () => {
		// Arrange
		const taskExecution = TaskExecution.create("Test Task", "project-123", "task-456", "account-789")
		await repository.save(taskExecution)
		const errorMessage = "Database connection failed"

		// Act
		await finishExecutionWithErrorUseCase.execute(taskExecution.id, errorMessage)

		// Assert
		const savedExecution = await repository.get(taskExecution.id)
		expect(savedExecution).toBeDefined()
		expect(savedExecution?.status).toBe(TaskExecutionStatus.FAILED)
		expect(savedExecution?.error).toBe(errorMessage)
	})

	it("should throw error when task execution not found", async () => {
		// Arrange
		const nonExistentId = "non-existent-id"
		const errorMessage = "Some error"

		// Act & Assert
		await expect(finishExecutionWithErrorUseCase.execute(nonExistentId, errorMessage)).rejects.toThrow(
			"Task execution not found",
		)
	})

	it("should update status from RUNNING to FAILED", async () => {
		// Arrange
		const taskExecution = TaskExecution.create("Test Task", "project-123", "task-456", "account-789")
		await repository.save(taskExecution)
		expect(taskExecution.status).toBe(TaskExecutionStatus.RUNNING)

		const errorMessage = "Execution failed"

		// Act
		await finishExecutionWithErrorUseCase.execute(taskExecution.id, errorMessage)

		// Assert
		const updatedExecution = await repository.get(taskExecution.id)
		expect(updatedExecution?.status).toBe(TaskExecutionStatus.FAILED)
	})

	it("should preserve other task execution properties", async () => {
		// Arrange
		const taskExecution = TaskExecution.create("Test Task", "project-123", "task-456", "account-789")
		await repository.save(taskExecution)
		const originalId = taskExecution.id
		const originalTitle = taskExecution.title
		const originalProjectId = taskExecution.projectId
		const originalTaskId = taskExecution.taskId
		const originalAccountId = taskExecution.accountId
		const originalOccurredAt = taskExecution.occurredAt

		const errorMessage = "Error occurred"

		// Act
		await finishExecutionWithErrorUseCase.execute(taskExecution.id, errorMessage)

		// Assert
		const updatedExecution = await repository.get(taskExecution.id)
		expect(updatedExecution?.id).toBe(originalId)
		expect(updatedExecution?.title).toBe(originalTitle)
		expect(updatedExecution?.projectId).toBe(originalProjectId)
		expect(updatedExecution?.taskId).toBe(originalTaskId)
		expect(updatedExecution?.accountId).toBe(originalAccountId)
		expect(updatedExecution?.occurredAt).toBe(originalOccurredAt)
	})
})
