import { TaskExecutionRepository } from "@application/ports/repositories/task-execution-repository"
import { TaskExecution } from "@domain/task-execution"
import { Pagination } from "@application/value-objects/pagination"
import { TimeRange } from "@application/value-objects/time-range"
import { Heatmap } from "@application/value-objects/heatmap"

export class InMemoryTaskExecutionRepository implements TaskExecutionRepository {
	private storage: Map<string, TaskExecution> = new Map()

	async save(taskExecution: TaskExecution): Promise<TaskExecution> {
		this.storage.set(taskExecution.id, taskExecution)
		return taskExecution
	}

	async get(taskExecutionId: string): Promise<TaskExecution | null> {
		const taskExecution = this.storage.get(taskExecutionId)
		return taskExecution || null
	}

	async getTimelineByProjectId(projectId: string, pagination: Pagination): Promise<TaskExecution[]> {
		const projectTaskExecutions = Array.from(this.storage.values())
			.filter((execution) => execution.projectId === projectId)
			.sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())

		const from = (pagination.pageNumber - 1) * pagination.pageSize
		const to = from + pagination.pageSize

		return projectTaskExecutions.slice(from, to)
	}

	async getTimelineByAccountId(accountId: string, pagination: Pagination): Promise<TaskExecution[]> {
		const accountTaskExecutions = Array.from(this.storage.values())
			.filter((execution) => execution.accountId === accountId)
			.sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())

		const from = (pagination.pageNumber - 1) * pagination.pageSize
		const to = from + pagination.pageSize

		return accountTaskExecutions.slice(from, to)
	}

	async getHeatmap(accountId: string, timeRange: TimeRange): Promise<Heatmap[]> {
		const startDate = new Date(timeRange.startDate)
		const endDate = new Date(timeRange.endDate)

		const filteredExecutions = Array.from(this.storage.values()).filter((execution) => {
			if (execution.accountId !== accountId) return false

			const executionDate = new Date(execution.occurredAt)
			return executionDate >= startDate && executionDate <= endDate
		})

		const runsByDate = new Map<string, number>()

		const currentDate = new Date(startDate)
		while (currentDate <= endDate) {
			const dateKey = currentDate.toISOString().split("T")[0]
			runsByDate.set(dateKey, 0)
			currentDate.setDate(currentDate.getDate() + 1)
		}

		filteredExecutions.forEach((execution) => {
			const dateKey = new Date(execution.occurredAt).toISOString().split("T")[0]
			const currentCount = runsByDate.get(dateKey) || 0
			runsByDate.set(dateKey, currentCount + 1)
		})

		const heatmap: Heatmap[] = Array.from(runsByDate.entries())
			.map(([date, runCount]) => ({
				date,
				runCount,
			}))
			.sort((a, b) => a.date.localeCompare(b.date))

		return heatmap
	}
}
