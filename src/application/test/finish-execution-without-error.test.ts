import { describe, it, expect, beforeEach } from "@rstest/core"
import { FinishExecutionWithoutError } from "@application/use-cases/finish-execution-without-error"
import { InMemoryTaskExecutionRepository } from "@application/test/mocks/in-memory-task-execution-repository"
import { TaskExecutionRepository } from "@application/ports/repositories/task-execution-repository"
import { TaskExecution } from "@domain/task-execution"
import { TaskExecutionStatus } from "@domain/task-execution-status"

describe("Finish Execution Without Error", () => {
	let finishExecutionWithoutErrorUseCase: FinishExecutionWithoutError
	let repository: TaskExecutionRepository

	beforeEach(() => {
		repository = new InMemoryTaskExecutionRepository()
		finishExecutionWithoutErrorUseCase = new FinishExecutionWithoutError(repository)
	})

	it("should successfully finish execution without error", async () => {
		// Arrange
		const taskExecution = TaskExecution.create("Test Task", "project-123", "task-456", "account-789")
		await repository.save(taskExecution)

		// Act
		await finishExecutionWithoutErrorUseCase.execute(taskExecution.id)

		// Assert
		const updatedExecution = await repository.get(taskExecution.id)
		expect(updatedExecution).toBeDefined()
		expect(updatedExecution?.status).toBe(TaskExecutionStatus.SUCCEEDED)
		expect(updatedExecution?.error).toBeUndefined()
	})

	it("should save the updated task execution to repository", async () => {
		// Arrange
		const taskExecution = TaskExecution.create("Test Task", "project-123", "task-456", "account-789")
		await repository.save(taskExecution)

		// Act
		await finishExecutionWithoutErrorUseCase.execute(taskExecution.id)

		// Assert
		const savedExecution = await repository.get(taskExecution.id)
		expect(savedExecution).toBeDefined()
		expect(savedExecution?.status).toBe(TaskExecutionStatus.SUCCEEDED)
	})

	it("should throw error when task execution not found", async () => {
		// Arrange
		const nonExistentId = "non-existent-id"

		// Act & Assert
		await expect(finishExecutionWithoutErrorUseCase.execute(nonExistentId)).rejects.toThrow(
			"Task execution not found",
		)
	})

	it("should update status from RUNNING to SUCCEEDED", async () => {
		// Arrange
		const taskExecution = TaskExecution.create("Test Task", "project-123", "task-456", "account-789")
		await repository.save(taskExecution)
		expect(taskExecution.status).toBe(TaskExecutionStatus.RUNNING)

		// Act
		await finishExecutionWithoutErrorUseCase.execute(taskExecution.id)

		// Assert
		const updatedExecution = await repository.get(taskExecution.id)
		expect(updatedExecution?.status).toBe(TaskExecutionStatus.SUCCEEDED)
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

		// Act
		await finishExecutionWithoutErrorUseCase.execute(taskExecution.id)

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
