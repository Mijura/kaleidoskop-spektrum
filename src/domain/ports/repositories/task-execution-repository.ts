import { TaskExecution } from "@domain/task-execution"
import { PaginationData, TaskExecutionHeatmap, TimeRangeData } from "@domain/task-execution-status"


export interface TaskExecutionRepository {
    save(taskExecution: TaskExecution): Promise<TaskExecution>
    get(taskExecutionId: string): Promise<TaskExecution | null>
    getTimelineByProjectId(projectId: string, pagination: PaginationData): Promise<TaskExecution[]>
    getTimelineByAccountId(accountId: string, pagination: PaginationData): Promise<TaskExecution[]>
    getHeatmap(accountId: string, timeRange: TimeRangeData): Promise<TaskExecutionHeatmap[]> 
}