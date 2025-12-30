import { PaginationDTO } from "@application/dto/pagination"
import { TaskExecutionDTO } from "@application/dto/task-execution"

export interface GetProjectExecutions {
    execute(projectId: string, pagination: PaginationDTO): Promise<TaskExecutionDTO[]>
}