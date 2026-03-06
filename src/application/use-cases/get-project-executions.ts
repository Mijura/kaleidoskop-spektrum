import { TaskExecution } from "@domain/task-execution"
import { TaskExecutionRepository } from "@application/ports/repositories/task-execution-repository"
import { GetProjectExecutionsUseCase, GetProjectExecutionsUseCaseParams } from "@application/ports/use-cases/get-project-executions"
import { Auth } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export class GetProjectExecutions implements GetProjectExecutionsUseCase {
	constructor(private readonly taskExecutionRepository: TaskExecutionRepository) {}

	async execute(auth: Auth<UserData>, params: GetProjectExecutionsUseCaseParams): Promise<TaskExecution[]> {
		console.log(`Auth data: ${JSON.stringify(auth)}`)
		const { projectId, pagination } = params
		
		const taskExecutions: TaskExecution[] = await this.taskExecutionRepository.getTimelineByProjectId(
			projectId,
			pagination,
		)
		return taskExecutions
	}
}
