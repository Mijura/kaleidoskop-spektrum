import { TaskExecutionStatus } from "@domain/value-objects/task-execution"

export interface TaskExecutionRecord {
    id: string
    title: string
    projectId: string
    taskId: string
    accountId: string
    status: TaskExecutionStatus
    occurredAt: string
    error?: string
} 