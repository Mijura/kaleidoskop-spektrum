import { describe, it, expect } from "@rstest/core"
import { TaskExecution } from "@domain/task-execution"
import { TaskExecutionStatus } from "@domain/task-execution-status"

describe("TaskExecution", () => {
	describe("create", () => {
		it("should create a new TaskExecution instance", () => {
			// Act
			const execution = TaskExecution.create("Test Task", "project-123", "task-456", "account-789")

			// Assert
			expect(execution).toBeInstanceOf(TaskExecution)
			expect(execution.id).toBeDefined()
			expect(typeof execution.id).toBe("string")
		})

		it("should create TaskExecution with a valid UUID v4 id", () => {
			// Act
			const execution = TaskExecution.create("Test Task", "project-123", "task-456", "account-789")

			// Assert
			const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
			expect(execution.id).toMatch(uuidV4Regex)
		})

		it("should create TaskExecution with correct initial values", () => {
			// Act
			const execution = TaskExecution.create("Test Task", "project-123", "task-456", "account-789")

			// Assert
			expect(execution.title).toBe("Test Task")
			expect(execution.projectId).toBe("project-123")
			expect(execution.taskId).toBe("task-456")
			expect(execution.accountId).toBe("account-789")
			expect(execution.status).toBe(TaskExecutionStatus.RUNNING)
			expect(execution.occurredAt).toBeDefined()
			expect(typeof execution.occurredAt).toBe("string")
			expect(execution.error).toBeUndefined()
		})

		it("should create TaskExecution with ISO string occurredAt timestamp", () => {
			// Act
			const execution = TaskExecution.create("Test Task", "project-123", "task-456", "account-789")

			// Assert
			const occurredAtDate = new Date(execution.occurredAt)
			expect(occurredAtDate.getTime()).not.toBeNaN()
			expect(execution.occurredAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
		})

		it("should create different TaskExecution instances with different IDs", () => {
			// Act
			const execution1 = TaskExecution.create("Task 1", "project-123", "task-456", "account-789")
			const execution2 = TaskExecution.create("Task 2", "project-123", "task-456", "account-789")
			const execution3 = TaskExecution.create("Task 3", "project-123", "task-456", "account-789")

			// Assert
			expect(execution1.id).not.toBe(execution2.id)
			expect(execution2.id).not.toBe(execution3.id)
			expect(execution1.id).not.toBe(execution3.id)
		})

		it("should create TaskExecution with RUNNING status", () => {
			// Act
			const execution = TaskExecution.create("Test Task", "project-123", "task-456", "account-789")

			// Assert
			expect(execution.status).toBe(TaskExecutionStatus.RUNNING)
		})

		it("should create TaskExecution that is ready to use", () => {
			// Arrange
			const execution = TaskExecution.create("Test Task", "project-123", "task-456", "account-789")

			// Act
			execution.finishSuccessfully()

			// Assert
			expect(execution.status).toBe(TaskExecutionStatus.SUCCEEDED)
		})

		it("should create TaskExecution with occurredAt timestamp close to current time", () => {
			// Arrange
			const beforeCreation = new Date().getTime()

			// Act
			const execution = TaskExecution.create("Test Task", "project-123", "task-456", "account-789")
			const afterCreation = new Date().getTime()
			const occurredAtTime = new Date(execution.occurredAt).getTime()

			// Assert
			expect(occurredAtTime).toBeGreaterThanOrEqual(beforeCreation)
			expect(occurredAtTime).toBeLessThanOrEqual(afterCreation)
		})
	})

	describe("constructor", () => {
		it("should create TaskExecution with all provided values", () => {
			// Arrange
			const id = "test-id-123"
			const title = "Test Title"
			const projectId = "project-456"
			const taskId = "task-789"
			const accountId = "account-012"
			const status = TaskExecutionStatus.SUCCEEDED
			const occurredAt = "2024-01-01T00:00:00.000Z"
			const error = "Test error"

			// Act
			const execution = new TaskExecution(id, title, projectId, taskId, accountId, status, occurredAt, error)

			// Assert
			expect(execution.id).toBe(id)
			expect(execution.title).toBe(title)
			expect(execution.projectId).toBe(projectId)
			expect(execution.taskId).toBe(taskId)
			expect(execution.accountId).toBe(accountId)
			expect(execution.status).toBe(status)
			expect(execution.occurredAt).toBe(occurredAt)
			expect(execution.error).toBe(error)
		})

		it("should create TaskExecution without error when error is not provided", () => {
			// Arrange
			const id = "test-id-456"
			const title = "Test Title"
			const projectId = "project-456"
			const taskId = "task-789"
			const accountId = "account-012"
			const status = TaskExecutionStatus.RUNNING
			const occurredAt = "2024-01-01T00:00:00.000Z"

			// Act
			const execution = new TaskExecution(id, title, projectId, taskId, accountId, status, occurredAt)

			// Assert
			expect(execution.error).toBeUndefined()
		})

		it("should preserve readonly properties after creation", () => {
			// Arrange
			const id = "test-id"
			const projectId = "project-123"
			const taskId = "task-456"
			const accountId = "account-789"
			const execution = new TaskExecution(
				id,
				"Title",
				projectId,
				taskId,
				accountId,
				TaskExecutionStatus.RUNNING,
				"2024-01-01T00:00:00.000Z",
			)

			// Act & Assert - readonly properties should remain unchanged
			expect(execution.id).toBe(id)
			expect(execution.projectId).toBe(projectId)
			expect(execution.taskId).toBe(taskId)
			expect(execution.accountId).toBe(accountId)
		})
	})

	describe("finishSuccessfully", () => {
		it("should change status to SUCCEEDED", () => {
			// Arrange
			const execution = TaskExecution.create("Test Task", "project-123", "task-456", "account-789")
			expect(execution.status).toBe(TaskExecutionStatus.RUNNING)

			// Act
			execution.finishSuccessfully()

			// Assert
			expect(execution.status).toBe(TaskExecutionStatus.SUCCEEDED)
		})

		it("should not modify error when finishing successfully", () => {
			// Arrange
			const execution = new TaskExecution(
				"test-id",
				"Test Task",
				"project-123",
				"task-456",
				"account-789",
				TaskExecutionStatus.RUNNING,
				"2024-01-01T00:00:00.000Z",
			)
			const originalError = execution.error

			// Act
			execution.finishSuccessfully()

			// Assert
			expect(execution.error).toBe(originalError)
		})

		it("should allow finishing successfully multiple times", () => {
			// Arrange
			const execution = TaskExecution.create("Test Task", "project-123", "task-456", "account-789")

			// Act
			execution.finishSuccessfully()
			execution.finishSuccessfully()

			// Assert
			expect(execution.status).toBe(TaskExecutionStatus.SUCCEEDED)
		})

		it("should change status from RUNNING to SUCCEEDED", () => {
			// Arrange
			const execution = new TaskExecution(
				"test-id",
				"Test Task",
				"project-123",
				"task-456",
				"account-789",
				TaskExecutionStatus.RUNNING,
				"2024-01-01T00:00:00.000Z",
			)

			// Act
			execution.finishSuccessfully()

			// Assert
			expect(execution.status).toBe(TaskExecutionStatus.SUCCEEDED)
		})

		it("should preserve all other properties when finishing successfully", () => {
			// Arrange
			const execution = TaskExecution.create("Test Task", "project-123", "task-456", "account-789")
			const originalId = execution.id
			const originalTitle = execution.title
			const originalProjectId = execution.projectId
			const originalTaskId = execution.taskId
			const originalAccountId = execution.accountId
			const originalOccurredAt = execution.occurredAt

			// Act
			execution.finishSuccessfully()

			// Assert
			expect(execution.id).toBe(originalId)
			expect(execution.title).toBe(originalTitle)
			expect(execution.projectId).toBe(originalProjectId)
			expect(execution.taskId).toBe(originalTaskId)
			expect(execution.accountId).toBe(originalAccountId)
			expect(execution.occurredAt).toBe(originalOccurredAt)
		})
	})

	describe("finishWithError", () => {
		it("should change status to FAILED", () => {
			// Arrange
			const execution = TaskExecution.create("Test Task", "project-123", "task-456", "account-789")
			expect(execution.status).toBe(TaskExecutionStatus.RUNNING)

			// Act
			execution.finishWithError("Something went wrong")

			// Assert
			expect(execution.status).toBe(TaskExecutionStatus.FAILED)
		})

		it("should set the error message", () => {
			// Arrange
			const execution = TaskExecution.create("Test Task", "project-123", "task-456", "account-789")
			const errorMessage = "Test error message"

			// Act
			execution.finishWithError(errorMessage)

			// Assert
			expect(execution.error).toBe(errorMessage)
		})

		it("should change status from RUNNING to FAILED", () => {
			// Arrange
			const execution = new TaskExecution(
				"test-id",
				"Test Task",
				"project-123",
				"task-456",
				"account-789",
				TaskExecutionStatus.RUNNING,
				"2024-01-01T00:00:00.000Z",
			)

			// Act
			execution.finishWithError("Error occurred")

			// Assert
			expect(execution.status).toBe(TaskExecutionStatus.FAILED)
		})

		it("should allow updating error message multiple times", () => {
			// Arrange
			const execution = TaskExecution.create("Test Task", "project-123", "task-456", "account-789")

			// Act
			execution.finishWithError("First error")
			execution.finishWithError("Second error")

			// Assert
			expect(execution.status).toBe(TaskExecutionStatus.FAILED)
			expect(execution.error).toBe("Second error")
		})

		it("should preserve all other properties when finishing with error", () => {
			// Arrange
			const execution = TaskExecution.create("Test Task", "project-123", "task-456", "account-789")
			const originalId = execution.id
			const originalTitle = execution.title
			const originalProjectId = execution.projectId
			const originalTaskId = execution.taskId
			const originalAccountId = execution.accountId
			const originalOccurredAt = execution.occurredAt

			// Act
			execution.finishWithError("Error message")

			// Assert
			expect(execution.id).toBe(originalId)
			expect(execution.title).toBe(originalTitle)
			expect(execution.projectId).toBe(originalProjectId)
			expect(execution.taskId).toBe(originalTaskId)
			expect(execution.accountId).toBe(originalAccountId)
			expect(execution.occurredAt).toBe(originalOccurredAt)
		})

		it("should allow empty error message", () => {
			// Arrange
			const execution = TaskExecution.create("Test Task", "project-123", "task-456", "account-789")

			// Act
			execution.finishWithError("")

			// Assert
			expect(execution.status).toBe(TaskExecutionStatus.FAILED)
			expect(execution.error).toBe("")
		})

		it("should overwrite existing error when finishing with new error", () => {
			// Arrange
			const execution = new TaskExecution(
				"test-id",
				"Test Task",
				"project-123",
				"task-456",
				"account-789",
				TaskExecutionStatus.FAILED,
				"2024-01-01T00:00:00.000Z",
				"Original error",
			)

			// Act
			execution.finishWithError("New error")

			// Assert
			expect(execution.error).toBe("New error")
			expect(execution.status).toBe(TaskExecutionStatus.FAILED)
		})
	})

	describe("status transitions", () => {
		it("should transition from RUNNING to SUCCEEDED", () => {
			// Arrange
			const execution = TaskExecution.create("Test Task", "project-123", "task-456", "account-789")

			// Act
			execution.finishSuccessfully()

			// Assert
			expect(execution.status).toBe(TaskExecutionStatus.SUCCEEDED)
		})

		it("should transition from RUNNING to FAILED", () => {
			// Arrange
			const execution = TaskExecution.create("Test Task", "project-123", "task-456", "account-789")

			// Act
			execution.finishWithError("Error")

			// Assert
			expect(execution.status).toBe(TaskExecutionStatus.FAILED)
		})

		it("should allow changing from SUCCEEDED to FAILED", () => {
			// Arrange
			const execution = new TaskExecution(
				"test-id",
				"Test Task",
				"project-123",
				"task-456",
				"account-789",
				TaskExecutionStatus.SUCCEEDED,
				"2024-01-01T00:00:00.000Z",
			)

			// Act
			execution.finishWithError("Error after success")

			// Assert
			expect(execution.status).toBe(TaskExecutionStatus.FAILED)
			expect(execution.error).toBe("Error after success")
		})

		it("should allow changing from FAILED to SUCCEEDED", () => {
			// Arrange
			const execution = new TaskExecution(
				"test-id",
				"Test Task",
				"project-123",
				"task-456",
				"account-789",
				TaskExecutionStatus.FAILED,
				"2024-01-01T00:00:00.000Z",
				"Previous error",
			)

			// Act
			execution.finishSuccessfully()

			// Assert
			expect(execution.status).toBe(TaskExecutionStatus.SUCCEEDED)
			expect(execution.error).toBe("Previous error") // Error is preserved
		})
	})

	describe("title property", () => {
		it("should allow updating title", () => {
			// Arrange
			const execution = TaskExecution.create("Original Title", "project-123", "task-456", "account-789")

			// Act
			execution.title = "Updated Title"

			// Assert
			expect(execution.title).toBe("Updated Title")
		})

		it("should preserve title through status changes", () => {
			// Arrange
			const execution = TaskExecution.create("Test Title", "project-123", "task-456", "account-789")

			// Act
			execution.finishSuccessfully()

			// Assert
			expect(execution.title).toBe("Test Title")
		})
	})
})
