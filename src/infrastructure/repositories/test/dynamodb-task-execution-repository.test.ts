import { describe, it, expect, beforeEach, afterEach } from "@rstest/core"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb"
import { DynamoDBTaskExecutionRepository } from "@infrastructure/repositories/dynamodb-task-execution-repository"
import { TaskExecution } from "@domain/task-execution"
import { TaskExecutionStatus } from "@domain/task-execution-status"
import { Pagination } from "@application/value-objects/pagination"
import { TimeRange } from "@application/value-objects/time-range"

describe("DynamoDB Task Execution Repository", () => {
	let repository: DynamoDBTaskExecutionRepository
	let ddbDocClient: DynamoDBDocumentClient
	const testTaskExecutionIds: string[] = []

	const client = new DynamoDBClient({
		region: process.env.AWS_REGION,
		profile: process.env.AWS_PROFILE,
	})

	beforeEach(() => {
		ddbDocClient = DynamoDBDocumentClient.from(client)
		repository = new DynamoDBTaskExecutionRepository()
	})

	afterEach(async () => {
		// Clean up test data from DynamoDB
		const tableName = process.env.TASK_EXECUTION_TABLE
		if (!tableName) return

		for (const id of testTaskExecutionIds) {
			try {
				await ddbDocClient.send(
					new DeleteCommand({
						TableName: tableName,
						Key: {
							id: id,
						},
					}),
				)
			} catch (error) {
				console.error(`Failed to delete test data with id ${id}:`, error)
			}
		}
		testTaskExecutionIds.length = 0
	})

	it("should save a task execution to DynamoDB", async () => {
		const taskExecution = TaskExecution.create("Test Task", "project-123", "task-456", "account-789")
		testTaskExecutionIds.push(taskExecution.id)

		const saved = await repository.save(taskExecution)

		expect(saved).toBeDefined()
		expect(saved.id).toEqual(taskExecution.id)
		expect(saved.title).toEqual(taskExecution.title)
		expect(saved.projectId).toEqual(taskExecution.projectId)
		expect(saved.taskId).toEqual(taskExecution.taskId)
		expect(saved.accountId).toEqual(taskExecution.accountId)
		expect(saved.status).toEqual(TaskExecutionStatus.RUNNING)
		expect(saved.occurredAt).toBeDefined()
	})

	it("should save a task execution with error to DynamoDB", async () => {
		const taskExecution = TaskExecution.create("Test Task", "project-123", "task-456", "account-789")
		taskExecution.finishWithError("Test error message")
		testTaskExecutionIds.push(taskExecution.id)

		const saved = await repository.save(taskExecution)

		expect(saved).toBeDefined()
		expect(saved.id).toEqual(taskExecution.id)
		expect(saved.status).toEqual(TaskExecutionStatus.FAILED)
		expect(saved.error).toEqual("Test error message")
	})

	it("should retrieve a previously saved task execution from DynamoDB", async () => {
		const taskExecution = TaskExecution.create("Test Task", "project-123", "task-456", "account-789")
		testTaskExecutionIds.push(taskExecution.id)

		await repository.save(taskExecution)
		const retrieved = await repository.get(taskExecution.id)

		expect(retrieved).toBeDefined()
		expect(retrieved?.id).toEqual(taskExecution.id)
		expect(retrieved?.title).toEqual(taskExecution.title)
		expect(retrieved?.projectId).toEqual(taskExecution.projectId)
		expect(retrieved?.taskId).toEqual(taskExecution.taskId)
		expect(retrieved?.accountId).toEqual(taskExecution.accountId)
		expect(retrieved?.status).toEqual(taskExecution.status)
		expect(retrieved?.occurredAt).toEqual(taskExecution.occurredAt)
	})

	it("should return null when retrieving a non-existent task execution", async () => {
		const nonExistentId = "non-existent-id"

		const retrieved = await repository.get(nonExistentId)

		expect(retrieved).toBeNull()
	})

	it("should retrieve task executions by project ID", async () => {
		const projectId = "project-123"
		const otherProjectId = "project-456"
		const taskExecution1 = TaskExecution.create("Task 1", projectId, "task-1", "account-789")
		const taskExecution2 = TaskExecution.create("Task 2", projectId, "task-2", "account-789")
		const taskExecution3 = TaskExecution.create("Task 3", otherProjectId, "task-3", "account-789")

		testTaskExecutionIds.push(taskExecution1.id, taskExecution2.id, taskExecution3.id)

		await repository.save(taskExecution1)
		await repository.save(taskExecution2)
		await repository.save(taskExecution3)

		const pagination: Pagination = {
			pageNumber: 1,
			pageSize: 10,
		}

		const retrieved = await repository.getTimelineByProjectId(projectId, pagination)

		expect(retrieved).toBeDefined()
		expect(Array.isArray(retrieved)).toBe(true)
		expect(retrieved.length).toBeGreaterThanOrEqual(2)
		expect(retrieved.map((e) => e.id)).toContain(taskExecution1.id)
		expect(retrieved.map((e) => e.id)).toContain(taskExecution2.id)
		expect(retrieved.every((e) => e.projectId === projectId)).toBe(true)
	})

	it("should return empty array when no task executions exist for project", async () => {
		const projectId = "project-with-no-executions"

		const pagination: Pagination = {
			pageNumber: 1,
			pageSize: 10,
		}

		const retrieved = await repository.getTimelineByProjectId(projectId, pagination)

		expect(retrieved).toBeDefined()
		expect(Array.isArray(retrieved)).toBe(true)
		expect(retrieved.length).toBe(0)
	})

	it("should handle pagination with pageNumber greater than 1 for project timeline", async () => {
		const projectId = "project-123"
		const taskExecution1 = TaskExecution.create("Task 1", projectId, "task-1", "account-789")
		testTaskExecutionIds.push(taskExecution1.id)

		await repository.save(taskExecution1)

		const pagination: Pagination = {
			pageNumber: 2,
			pageSize: 10,
		}

		// This should trigger the pagination warning branch
		const retrieved = await repository.getTimelineByProjectId(projectId, pagination)

		expect(retrieved).toBeDefined()
		expect(Array.isArray(retrieved)).toBe(true)
	})

	it("should retrieve task executions by account ID", async () => {
		const accountId = "account-123"
		const otherAccountId = "account-456"
		const taskExecution1 = TaskExecution.create("Task 1", "project-1", "task-1", accountId)
		const taskExecution2 = TaskExecution.create("Task 2", "project-2", "task-2", accountId)
		const taskExecution3 = TaskExecution.create("Task 3", "project-3", "task-3", otherAccountId)

		testTaskExecutionIds.push(taskExecution1.id, taskExecution2.id, taskExecution3.id)

		await repository.save(taskExecution1)
		await repository.save(taskExecution2)
		await repository.save(taskExecution3)

		const pagination: Pagination = {
			pageNumber: 1,
			pageSize: 10,
		}

		const retrieved = await repository.getTimelineByAccountId(accountId, pagination)

		expect(retrieved).toBeDefined()
		expect(Array.isArray(retrieved)).toBe(true)
		expect(retrieved.length).toBeGreaterThanOrEqual(2)
		expect(retrieved.map((e) => e.id)).toContain(taskExecution1.id)
		expect(retrieved.map((e) => e.id)).toContain(taskExecution2.id)
		expect(retrieved.every((e) => e.accountId === accountId)).toBe(true)
	})

	it("should return empty array when no task executions exist for account", async () => {
		const accountId = "account-with-no-executions"

		const pagination: Pagination = {
			pageNumber: 1,
			pageSize: 10,
		}

		const retrieved = await repository.getTimelineByAccountId(accountId, pagination)

		expect(retrieved).toBeDefined()
		expect(Array.isArray(retrieved)).toBe(true)
		expect(retrieved.length).toBe(0)
	})

	it("should handle pagination with pageNumber greater than 1 for account timeline", async () => {
		const accountId = "account-123"
		const taskExecution1 = TaskExecution.create("Task 1", "project-1", "task-1", accountId)
		testTaskExecutionIds.push(taskExecution1.id)

		await repository.save(taskExecution1)

		const pagination: Pagination = {
			pageNumber: 2,
			pageSize: 10,
		}

		// This should trigger the pagination warning branch
		const retrieved = await repository.getTimelineByAccountId(accountId, pagination)

		expect(retrieved).toBeDefined()
		expect(Array.isArray(retrieved)).toBe(true)
	})

	it("should retrieve heatmap data for account", async () => {
		const accountId = "account-789"
		const now = new Date()
		const yesterday = new Date(now)
		yesterday.setDate(yesterday.getDate() - 1)
		const twoDaysAgo = new Date(now)
		twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

		const taskExecution1 = TaskExecution.create("Task 1", "project-1", "task-1", accountId)
		taskExecution1.occurredAt = yesterday.toISOString()
		const taskExecution2 = TaskExecution.create("Task 2", "project-2", "task-2", accountId)
		taskExecution2.occurredAt = yesterday.toISOString()
		const taskExecution3 = TaskExecution.create("Task 3", "project-3", "task-3", accountId)
		taskExecution3.occurredAt = twoDaysAgo.toISOString()

		testTaskExecutionIds.push(taskExecution1.id, taskExecution2.id, taskExecution3.id)

		await repository.save(taskExecution1)
		await repository.save(taskExecution2)
		await repository.save(taskExecution3)

		const timeRange: TimeRange = {
			startDate: twoDaysAgo.toISOString(),
			endDate: now.toISOString(),
		}

		const heatmap = await repository.getHeatmap(accountId, timeRange)

		expect(heatmap).toBeDefined()
		expect(Array.isArray(heatmap)).toBe(true)
		expect(heatmap.length).toBeGreaterThan(0)
		expect(heatmap.every((h) => h.date && typeof h.runCount === "number")).toBe(true)
	})

	it("should return empty heatmap when no task executions exist in time range", async () => {
		const accountId = "account-with-no-executions"
		const now = new Date()
		const startDate = new Date(now)
		startDate.setDate(startDate.getDate() - 7)
		const endDate = new Date(now)
		endDate.setDate(endDate.getDate() - 1)

		const timeRange: TimeRange = {
			startDate: startDate.toISOString(),
			endDate: endDate.toISOString(),
		}

		const heatmap = await repository.getHeatmap(accountId, timeRange)

		expect(heatmap).toBeDefined()
		expect(Array.isArray(heatmap)).toBe(true)
		// Should still have entries for all dates in range, but with runCount 0
		expect(heatmap.length).toBeGreaterThan(0)
	})

	it("should save and retrieve a task execution with all properties correctly", async () => {
		const taskExecution = TaskExecution.create("My Task", "project-456", "task-789", "account-123")
		taskExecution.finishSuccessfully()
		testTaskExecutionIds.push(taskExecution.id)

		await repository.save(taskExecution)
		const retrieved = await repository.get(taskExecution.id)

		expect(retrieved).toBeDefined()
		expect(retrieved?.id).toEqual(taskExecution.id)
		expect(retrieved?.title).toEqual("My Task")
		expect(retrieved?.projectId).toEqual("project-456")
		expect(retrieved?.taskId).toEqual("task-789")
		expect(retrieved?.accountId).toEqual("account-123")
		expect(retrieved?.status).toEqual(TaskExecutionStatus.SUCCEEDED)
		expect(retrieved?.occurredAt).toEqual(taskExecution.occurredAt)
	})

	it("should update an existing task execution when saving again", async () => {
		const taskExecution = TaskExecution.create("Initial Task", "project-123", "task-456", "account-789")
		testTaskExecutionIds.push(taskExecution.id)

		await repository.save(taskExecution)
		taskExecution.finishWithError("Updated error message")

		const updated = await repository.save(taskExecution)
		const retrieved = await repository.get(taskExecution.id)

		expect(updated.status).toEqual(TaskExecutionStatus.FAILED)
		expect(updated.error).toEqual("Updated error message")
		expect(retrieved?.status).toEqual(TaskExecutionStatus.FAILED)
		expect(retrieved?.error).toEqual("Updated error message")
	})

	it("should throw an error when saving task execution without ID", async () => {
		const taskExecution = TaskExecution.create("Test Task", "project-123", "task-456", "account-789")
		// @ts-expect-error - Intentionally removing ID to test error case
		taskExecution.id = undefined

		await expect(repository.save(taskExecution)).rejects.toThrow(
			"taskExecution.id is required for saving. Missing ID may cause unintended document creation.",
		)
	})

	it("should throw an error when DynamoDB get operation fails", async () => {
		// Temporarily set an empty table name to trigger a DynamoDB validation error
		const originalTableName = process.env.TASK_EXECUTION_TABLE
		process.env.TASK_EXECUTION_TABLE = ""

		try {
			await expect(repository.get("some-id")).rejects.toThrow()
		} finally {
			// Restore original table name
			if (originalTableName) {
				process.env.TASK_EXECUTION_TABLE = originalTableName
			} else {
				delete process.env.TASK_EXECUTION_TABLE
			}
		}
	})

	it("should throw an error when DynamoDB save operation fails", async () => {
		// Temporarily set an empty table name to trigger a DynamoDB validation error
		const originalTableName = process.env.TASK_EXECUTION_TABLE
		process.env.TASK_EXECUTION_TABLE = ""

		const taskExecution = TaskExecution.create("Test Task", "project-123", "task-456", "account-789")
		// Note: Not tracking for cleanup since save will fail and nothing will be written to DynamoDB

		try {
			await expect(repository.save(taskExecution)).rejects.toThrow()
		} finally {
			// Restore original table name
			if (originalTableName) {
				process.env.TASK_EXECUTION_TABLE = originalTableName
			} else {
				delete process.env.TASK_EXECUTION_TABLE
			}
		}
	})

	it("should throw an error when DynamoDB getTimelineByProjectId operation fails", async () => {
		// Temporarily set an empty table name to trigger a DynamoDB validation error
		const originalTableName = process.env.TASK_EXECUTION_TABLE
		process.env.TASK_EXECUTION_TABLE = ""

		const pagination: Pagination = {
			pageNumber: 1,
			pageSize: 10,
		}

		try {
			await expect(repository.getTimelineByProjectId("project-123", pagination)).rejects.toThrow()
		} finally {
			// Restore original table name
			if (originalTableName) {
				process.env.TASK_EXECUTION_TABLE = originalTableName
			} else {
				delete process.env.TASK_EXECUTION_TABLE
			}
		}
	})

	it("should throw an error when DynamoDB getTimelineByAccountId operation fails", async () => {
		// Temporarily set an empty table name to trigger a DynamoDB validation error
		const originalTableName = process.env.TASK_EXECUTION_TABLE
		process.env.TASK_EXECUTION_TABLE = ""

		const pagination: Pagination = {
			pageNumber: 1,
			pageSize: 10,
		}

		try {
			await expect(repository.getTimelineByAccountId("account-123", pagination)).rejects.toThrow()
		} finally {
			// Restore original table name
			if (originalTableName) {
				process.env.TASK_EXECUTION_TABLE = originalTableName
			} else {
				delete process.env.TASK_EXECUTION_TABLE
			}
		}
	})

	it("should throw an error when DynamoDB getHeatmap operation fails", async () => {
		// Temporarily set an empty table name to trigger a DynamoDB validation error
		const originalTableName = process.env.TASK_EXECUTION_TABLE
		process.env.TASK_EXECUTION_TABLE = ""

		const now = new Date()
		const startDate = new Date(now)
		startDate.setDate(startDate.getDate() - 7)

		const timeRange: TimeRange = {
			startDate: startDate.toISOString(),
			endDate: now.toISOString(),
		}

		try {
			await expect(repository.getHeatmap("account-123", timeRange)).rejects.toThrow()
		} finally {
			// Restore original table name
			if (originalTableName) {
				process.env.TASK_EXECUTION_TABLE = originalTableName
			} else {
				delete process.env.TASK_EXECUTION_TABLE
			}
		}
	})

	it("should correctly map task execution with error field through repository operations", async () => {
		const taskExecution = TaskExecution.create("Test Task", "project-123", "task-456", "account-789")
		taskExecution.finishWithError("Test error message")
		testTaskExecutionIds.push(taskExecution.id)

		await repository.save(taskExecution)
		const retrieved = await repository.get(taskExecution.id)

		expect(retrieved).toBeDefined()
		expect(retrieved?.error).toBe("Test error message")
		expect(retrieved?.status).toBe(TaskExecutionStatus.FAILED)
	})

	it("should correctly map task execution with all status types through repository operations", async () => {
		const runningExecution = TaskExecution.create("Running Task", "project-123", "task-1", "account-789")
		testTaskExecutionIds.push(runningExecution.id)
		await repository.save(runningExecution)
		const retrievedRunning = await repository.get(runningExecution.id)
		expect(retrievedRunning?.status).toBe(TaskExecutionStatus.RUNNING)

		runningExecution.finishSuccessfully()
		await repository.save(runningExecution)
		const retrievedSucceeded = await repository.get(runningExecution.id)
		expect(retrievedSucceeded?.status).toBe(TaskExecutionStatus.SUCCEEDED)

		runningExecution.finishWithError("Error")
		await repository.save(runningExecution)
		const retrievedFailed = await repository.get(runningExecution.id)
		expect(retrievedFailed?.status).toBe(TaskExecutionStatus.FAILED)
	})

	it("should correctly map multiple task executions through getTimelineByProjectId", async () => {
		const projectId = "project-mapping-test"
		const taskExecution1 = TaskExecution.create("Task 1", projectId, "task-1", "account-789")
		taskExecution1.finishSuccessfully()
		const taskExecution2 = TaskExecution.create("Task 2", projectId, "task-2", "account-789")
		taskExecution2.finishWithError("Error in task 2")
		const taskExecution3 = TaskExecution.create("Task 3", projectId, "task-3", "account-789")
		// Task 3 remains in RUNNING state

		testTaskExecutionIds.push(taskExecution1.id, taskExecution2.id, taskExecution3.id)

		await repository.save(taskExecution1)
		await repository.save(taskExecution2)
		await repository.save(taskExecution3)

		const pagination: Pagination = {
			pageNumber: 1,
			pageSize: 10,
		}

		const retrieved = await repository.getTimelineByProjectId(projectId, pagination)

		expect(retrieved).toBeDefined()
		expect(Array.isArray(retrieved)).toBe(true)
		expect(retrieved.length).toBeGreaterThanOrEqual(3)

		const retrieved1 = retrieved.find((e) => e.id === taskExecution1.id)
		const retrieved2 = retrieved.find((e) => e.id === taskExecution2.id)
		const retrieved3 = retrieved.find((e) => e.id === taskExecution3.id)

		expect(retrieved1?.status).toBe(TaskExecutionStatus.SUCCEEDED)
		expect(retrieved1?.error).toBeUndefined()
		expect(retrieved2?.status).toBe(TaskExecutionStatus.FAILED)
		expect(retrieved2?.error).toBe("Error in task 2")
		expect(retrieved3?.status).toBe(TaskExecutionStatus.RUNNING)
		expect(retrieved3?.error).toBeUndefined()
	})

	it("should correctly map multiple task executions through getTimelineByAccountId", async () => {
		const accountId = "account-mapping-test"
		const taskExecution1 = TaskExecution.create("Task 1", "project-1", "task-1", accountId)
		taskExecution1.finishSuccessfully()
		const taskExecution2 = TaskExecution.create("Task 2", "project-2", "task-2", accountId)
		taskExecution2.finishWithError("Error in task 2")

		testTaskExecutionIds.push(taskExecution1.id, taskExecution2.id)

		await repository.save(taskExecution1)
		await repository.save(taskExecution2)

		const pagination: Pagination = {
			pageNumber: 1,
			pageSize: 10,
		}

		const retrieved = await repository.getTimelineByAccountId(accountId, pagination)

		expect(retrieved).toBeDefined()
		expect(Array.isArray(retrieved)).toBe(true)
		expect(retrieved.length).toBeGreaterThanOrEqual(2)

		const retrieved1 = retrieved.find((e) => e.id === taskExecution1.id)
		const retrieved2 = retrieved.find((e) => e.id === taskExecution2.id)

		expect(retrieved1?.status).toBe(TaskExecutionStatus.SUCCEEDED)
		expect(retrieved1?.error).toBeUndefined()
		expect(retrieved2?.status).toBe(TaskExecutionStatus.FAILED)
		expect(retrieved2?.error).toBe("Error in task 2")
	})
})
