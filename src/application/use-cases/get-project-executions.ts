import { TaskExecution } from "@domain/task-execution"
import { TaskExecutionRepository } from "@application/ports/repositories/task-execution-repository"
import { GetProjectExecutions } from "@application/ports/use-cases/get-project-executions"
import { PaginationDTO } from "@application/dto/pagination"
import { TaskExecutionDTO } from "@application/dto/task-execution"
import { TaskExecutionMapper } from "@application/mappers/task-execution"

export class GetProjectExecutionsUseCase implements GetProjectExecutions {

    constructor(private readonly taskExecutionRepository: TaskExecutionRepository) {}

    async execute(projectId: string, pagination: PaginationDTO): Promise<TaskExecutionDTO[]> {
        const taskExecutions: TaskExecution[] = await this.taskExecutionRepository.getTimelineByProjectId(projectId, pagination)
        return TaskExecutionMapper.toDTOs(taskExecutions)
    }
}