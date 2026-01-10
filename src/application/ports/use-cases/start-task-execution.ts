import { TaskExecution } from "@domain/task-execution"

export interface StartTaskExecution {
	execute(title: string, projectId: string, taskId: string, accountId: string): Promise<TaskExecution>
}