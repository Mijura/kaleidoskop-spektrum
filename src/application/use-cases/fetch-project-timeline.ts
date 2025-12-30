import { TaskExecution } from "@domain/task-execution"
import { TaskExecutionRepository } from "@domain/ports/repositories/task-execution-repository"
import { FetchTaskExecutionsTimeline } from "@application/ports/use-cases/fetch-timeline"
import { PaginationData } from "@application/dto/task-execution"

export class FetchTimelineByProjectIdUseCase implements FetchTaskExecutionsTimeline {
    constructor(private readonly taskExecutionRepository: TaskExecutionRepository) {}

    async execute(projectId: string, pagination: PaginationData): Promise<TaskExecution[]> {
        return await this.taskExecutionRepository.getTimelineByProjectId(projectId, pagination)
    }
}