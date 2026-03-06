import { TaskExecutionRepository } from "@application/ports/repositories/task-execution-repository"
import { StartTaskExecutionUseCase, StartTaskExecutionUseCaseParams } from "@application/ports/use-cases/start-task-execution"
import { TaskExecution } from "@domain/task-execution"
import { Auth } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export class StartTaskExecution implements StartTaskExecutionUseCase {
	constructor(private readonly taskExecutionRepository: TaskExecutionRepository) {}

	async execute(auth: Auth<UserData>, params: StartTaskExecutionUseCaseParams): Promise<TaskExecution> {
		console.log(`Auth data: ${JSON.stringify(auth)}`)
		const { title, projectId, taskId } = params
		const taskExecution = TaskExecution.create(title, projectId, taskId, auth.data.userId)
		const savedTaskExecution: TaskExecution = await this.taskExecutionRepository.save(taskExecution)
		return savedTaskExecution
	}
}
