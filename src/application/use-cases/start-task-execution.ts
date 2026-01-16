import { TaskExecutionRepository } from "@application/ports/repositories/task-execution-repository"
import { StartTaskExecutionUseCase } from "@application/ports/use-cases/start-task-execution"
import { TaskExecution } from "@domain/task-execution"

export class StartTaskExecution implements StartTaskExecutionUseCase {
	constructor(private readonly taskExecutionRepository: TaskExecutionRepository) {}

	async execute(title: string, projectId: string, taskId: string, accountId: string): Promise<TaskExecution> {
		const taskExecution = TaskExecution.create(title, projectId, taskId, accountId)
		const savedTaskExecution: TaskExecution = await this.taskExecutionRepository.save(taskExecution)
		return savedTaskExecution
	}
}
