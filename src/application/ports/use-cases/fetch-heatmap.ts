import { TaskExecutionHeatmap, TimeRangeData } from "@domain/task-execution-status"

export interface FetchTaskExecutionsHeatmap {
    execute(accountId: string, timeRange: TimeRangeData): Promise<TaskExecutionHeatmap[]>
}