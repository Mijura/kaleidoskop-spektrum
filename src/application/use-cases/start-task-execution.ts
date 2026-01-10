import { TaskExecutionRepository } from "@application/ports/repositories/task-execution-repository"
import { StartTaskExecution } from "@application/ports/use-cases/start-task-execution"
import { TaskExecution } from "@domain/task-execution"



export class StartTaskExecutionUseCase implements StartTaskExecution {
	constructor(private readonly taskExecutionRepository: TaskExecutionRepository) {}

	async execute(title: string, projectId: string, taskId: string, accountId: string): Promise<TaskExecution> {
        const taskExecution = TaskExecution.create(title, projectId, taskId, accountId)
		const savedTaskExecution: TaskExecution = await this.taskExecutionRepository.save(taskExecution)
		return savedTaskExecution
	}
}