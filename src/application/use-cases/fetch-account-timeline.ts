import { TaskExecution } from "@domain/task-execution"
import { TaskExecutionRepository } from "@domain/ports/repositories/task-execution-repository"
import { FetchTaskExecutionsTimeline } from "@application/ports/use-cases/fetch-timeline"
import { PaginationData } from "@domain/task-execution-status"

export class FetchTimelineByAccountIdUseCase implements FetchTaskExecutionsTimeline {
    constructor(private readonly taskExecutionRepository: TaskExecutionRepository) {}

    async execute(accountId: string, pagination: PaginationData): Promise<TaskExecution[]> {
        return await this.taskExecutionRepository.getTimelineByAccountId(accountId, pagination)
    }
}