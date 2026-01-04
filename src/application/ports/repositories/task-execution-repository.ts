import { PaginationDTO } from "@application/dto/pagination"
import { TimeRangeDTO } from "@application/dto/time-range"
import { HeatmapDTO } from "@application/dto/heatmap"
import { TaskExecution } from "@domain/task-execution"

export interface TaskExecutionRepository {
	save(taskExecution: TaskExecution): Promise<TaskExecution>
	get(taskExecutionId: string): Promise<TaskExecution | null>
	getTimelineByProjectId(projectId: string, pagination: PaginationDTO): Promise<TaskExecution[]>
	getTimelineByAccountId(accountId: string, pagination: PaginationDTO): Promise<TaskExecution[]>
	getHeatmap(accountId: string, timeRange: TimeRangeDTO): Promise<HeatmapDTO[]>
}
