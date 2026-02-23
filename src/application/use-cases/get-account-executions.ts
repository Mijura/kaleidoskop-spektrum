import { TaskExecution } from "@domain/task-execution"
import { TaskExecutionRepository } from "@application/ports/repositories/task-execution-repository"
import { GetAccountExecutionsUseCase, GetAccountExecutionsUseCaseParams } from "@application/ports/use-cases/get-account-executions"
import { Auth } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export class GetAccountExecutions implements GetAccountExecutionsUseCase {
	constructor(private readonly taskExecutionRepository: TaskExecutionRepository) {}

	async execute(auth: Auth<UserData>, params: GetAccountExecutionsUseCaseParams): Promise<TaskExecution[]> {
		console.log(`Auth data: ${JSON.stringify(auth)}`)
		const { pagination } = params
		
		const taskExecutions: TaskExecution[] = await this.taskExecutionRepository.getTimelineByAccountId(
			auth.data.userId,
			pagination,
		)
		return taskExecutions
	}
}
