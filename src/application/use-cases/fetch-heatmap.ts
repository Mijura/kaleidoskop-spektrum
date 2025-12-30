import { TaskExecutionRepository } from "@domain/ports/repositories/task-execution-repository"
import { FetchTaskExecutionsHeatmap } from "@application/ports/use-cases/fetch-heatmap"
import { TaskExecutionHeatmap, TimeRangeData } from "@application/dto/task-execution"

export class FetchTaskExecutionsHeatmapUseCase implements FetchTaskExecutionsHeatmap {

    constructor(private readonly taskExecutionRepository: TaskExecutionRepository) {}


    execute(accountId: string, timeRange: TimeRangeData): Promise<TaskExecutionHeatmap[]> {
        
        return this.taskExecutionRepository.getHeatmap(accountId, timeRange)
    }

    
}