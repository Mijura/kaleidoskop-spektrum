import { describe, it, expect } from "@rstest/core"
import { TaskExecutionStatus } from "@domain/task-execution-status"

describe("TaskExecutionStatus", () => {
	describe("enum values", () => {
		it("should have RUNNING status with correct value", () => {
			// Assert
			expect(TaskExecutionStatus.RUNNING).toBe("Running")
		})

		it("should have SUCCEEDED status with correct value", () => {
			// Assert
			expect(TaskExecutionStatus.SUCCEEDED).toBe("Succeeded")
		})

		it("should have FAILED status with correct value", () => {
			// Assert
			expect(TaskExecutionStatus.FAILED).toBe("Failed")
		})

		it("should have all three status values", () => {
			// Assert
			expect(Object.values(TaskExecutionStatus)).toHaveLength(3)
			expect(Object.values(TaskExecutionStatus)).toContain("Running")
			expect(Object.values(TaskExecutionStatus)).toContain("Succeeded")
			expect(Object.values(TaskExecutionStatus)).toContain("Failed")
		})
	})

	describe("enum usage", () => {
		it("should be usable in comparisons", () => {
			// Arrange
			const status = TaskExecutionStatus.RUNNING

			// Assert
			expect(status).toBe(TaskExecutionStatus.RUNNING)
			expect(status).not.toBe(TaskExecutionStatus.SUCCEEDED)
			expect(status).not.toBe(TaskExecutionStatus.FAILED)
		})

		it("should allow switching between status values", () => {
			// Arrange
			let status = TaskExecutionStatus.RUNNING

			// Act & Assert
			expect(status).toBe(TaskExecutionStatus.RUNNING)

			status = TaskExecutionStatus.SUCCEEDED
			expect(status).toBe(TaskExecutionStatus.SUCCEEDED)

			status = TaskExecutionStatus.FAILED
			expect(status).toBe(TaskExecutionStatus.FAILED)
		})

		it("should be comparable with string values", () => {
			// Assert
			expect(TaskExecutionStatus.RUNNING).toBe("Running")
			expect(TaskExecutionStatus.SUCCEEDED).toBe("Succeeded")
			expect(TaskExecutionStatus.FAILED).toBe("Failed")
		})

		it("should have unique values for each status", () => {
			// Assert
			const values = Object.values(TaskExecutionStatus)
			const uniqueValues = new Set(values)
			expect(uniqueValues.size).toBe(values.length)
		})
	})
})
