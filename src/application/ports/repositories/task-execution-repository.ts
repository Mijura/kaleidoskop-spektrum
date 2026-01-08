import { Pagination } from "@application/value-objects/pagination"
import { TimeRange } from "@application/value-objects/time-range"
import { Heatmap } from "@application/value-objects/heatmap"
import { TaskExecution } from "@domain/task-execution"

export interface TaskExecutionRepository {
	save(taskExecution: TaskExecution): Promise<TaskExecution>
	get(taskExecutionId: string): Promise<TaskExecution | null>
	getTimelineByProjectId(projectId: string, pagination: Pagination): Promise<TaskExecution[]>
	getTimelineByAccountId(accountId: string, pagination: Pagination): Promise<TaskExecution[]>
	getHeatmap(accountId: string, timeRange: TimeRange): Promise<Heatmap[]>
}
