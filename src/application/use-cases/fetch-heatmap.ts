import { TaskExecutionRepository } from "@domain/ports/repositories/task-execution-repository"
import { FetchTaskExecutionsHeatmap } from "@domain/use-cases/fetch-heatmap"
import { TimeRangeData, TaskExecutionHeatmap } from "@domain/value-objects/task-execution"

export class FetchTaskExecutionsHeatmapUseCase implements FetchTaskExecutionsHeatmap{

    constructor(private readonly taskExecutionRepository: TaskExecutionRepository) {}


    execute(accountId: string, timeRange: TimeRangeData): Promise<TaskExecutionHeatmap[]> {
        
        return this.taskExecutionRepository.getHeatmap(accountId, timeRange)
    }

    
}