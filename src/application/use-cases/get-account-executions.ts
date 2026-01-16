import { TaskExecution } from "@domain/task-execution"
import { TaskExecutionRepository } from "@application/ports/repositories/task-execution-repository"
import { GetAccountExecutionsUseCase } from "@application/ports/use-cases/get-account-executions"
import { Pagination } from "@application/value-objects/pagination"

export class GetAccountExecutions implements GetAccountExecutionsUseCase {
	constructor(private readonly taskExecutionRepository: TaskExecutionRepository) {}

	async execute(accountId: string, pagination: Pagination): Promise<TaskExecution[]> {
		const taskExecutions: TaskExecution[] = await this.taskExecutionRepository.getTimelineByAccountId(
			accountId,
			pagination,
		)
		return taskExecutions
	}
}
