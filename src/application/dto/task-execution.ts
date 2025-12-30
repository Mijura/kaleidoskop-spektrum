import { TaskExecutionStatus } from "@domain/task-execution-status"

export type TaskExecutionDTO = {
    id: string
    title: string
    projectId: string
    taskId: string
    accountId: string
    status: TaskExecutionStatus
    occurredAt: string
    error?: string
}