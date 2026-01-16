import { Pagination } from "@application/value-objects/pagination"
import { TaskExecution } from "@domain/task-execution"

export interface GetProjectExecutionsUseCase {
	execute(projectId: string, pagination: Pagination): Promise<TaskExecution[]>
}
