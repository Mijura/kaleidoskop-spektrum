import { TaskExecution } from "@domain/task-execution"
import { PaginationData } from "@domain/task-execution-status"

export interface FetchTaskExecutionsTimeline {
    execute(projectId: string, pagination: PaginationData): Promise<TaskExecution[]>
}