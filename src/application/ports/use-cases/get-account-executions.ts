import { PaginationDTO } from "@application/dto/pagination"
import { TaskExecutionDTO } from "@application/dto/task-execution"

export interface GetAccountExecutions {
	execute(accountId: string, pagination: PaginationDTO): Promise<TaskExecutionDTO[]>
}
