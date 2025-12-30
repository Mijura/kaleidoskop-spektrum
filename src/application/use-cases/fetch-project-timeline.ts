import { TaskExecution } from "@domain/task-execution"
import { TaskExecutionRepository } from "@application/ports/repositories/task-execution-repository"
import { FetchTaskExecutionsTimeline } from "@application/ports/use-cases/fetch-timeline"
import { PaginationDTO } from "@application/dto/pagination"
import { TaskExecutionDTO } from "@application/dto/task-execution"
import { TaskExecutionMapper } from "@application/mappers/task-execution"

export class FetchTimelineByProjectIdUseCase implements FetchTaskExecutionsTimeline {
    constructor(private readonly taskExecutionRepository: TaskExecutionRepository) {}

    async execute(projectId: string, pagination: PaginationDTO): Promise<TaskExecutionDTO[]> {
        const taskExecutions: TaskExecution[] = await this.taskExecutionRepository.getTimelineByProjectId(projectId, pagination)
        return TaskExecutionMapper.toDTOs(taskExecutions)
    }
}