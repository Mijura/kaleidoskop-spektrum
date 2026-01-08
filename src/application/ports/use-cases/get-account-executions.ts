import { Pagination } from "@application/value-objects/pagination"
import { TaskExecution } from "@domain/task-execution"

export interface GetAccountExecutions {
	execute(accountId: string, pagination: Pagination): Promise<TaskExecution[]>
}
