import { TaskExecutionRepository } from "@application/ports/repositories/task-execution-repository"
import { FetchTaskExecutionsHeatmap } from "@application/ports/use-cases/fetch-heatmap"
import { TimeRangeDTO } from "@application/dto/time-range"
import { HeatmapDTO } from "@application/dto/heatmap"

export class FetchTaskExecutionsHeatmapUseCase implements FetchTaskExecutionsHeatmap {

    constructor(private readonly taskExecutionRepository: TaskExecutionRepository) {}


    execute(accountId: string, timeRange: TimeRangeDTO): Promise<HeatmapDTO[]> {
        
        return this.taskExecutionRepository.getHeatmap(accountId, timeRange)
    }

    
}