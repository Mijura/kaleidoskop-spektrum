import { Pagination } from "@application/value-objects/pagination"
import { TaskExecution } from "@domain/task-execution"

export interface GetAccountExecutionsUseCase {
	execute(accountId: string, pagination: Pagination): Promise<TaskExecution[]>
}
