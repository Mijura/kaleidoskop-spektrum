import { TaskExecution } from "@domain/task-execution"

export interface StartTaskExecutionUseCase {
	execute(title: string, projectId: string, taskId: string, accountId: string): Promise<TaskExecution>
}
