import { TaskExecution } from "@domain/task-execution"
import { TaskExecutionRepository } from "@application/ports/repositories/task-execution-repository"
import { GetAccountExecutions } from "@application/ports/use-cases/get-account-executions"
import { PaginationDTO } from "@application/dto/pagination"
import { TaskExecutionDTO } from "@application/dto/task-execution"
import { TaskExecutionMapper } from "@application/mappers/task-execution"

export class GetAccountExecutionsUseCase implements GetAccountExecutions {
    
    constructor(private readonly taskExecutionRepository: TaskExecutionRepository) {}

    async execute(accountId: string, pagination: PaginationDTO): Promise<TaskExecutionDTO[]> {
        const taskExecutions: TaskExecution[] = await this.taskExecutionRepository.getTimelineByAccountId(accountId, pagination)
        return TaskExecutionMapper.toDTOs(taskExecutions)
    }
}