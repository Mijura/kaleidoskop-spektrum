import { TaskExecutionRepository } from "@application/ports/repositories/task-execution-repository"
import { GetExecutionHeatmap } from "@application/ports/use-cases/get-execution-heatmap"
import { TimeRangeDTO } from "@application/dto/time-range"
import { HeatmapDTO } from "@application/dto/heatmap"

export class GetExecutionHeatmapUseCase implements GetExecutionHeatmap {

    constructor(private readonly taskExecutionRepository: TaskExecutionRepository) {}

    execute(accountId: string, timeRange: TimeRangeDTO): Promise<HeatmapDTO[]> {
        return this.taskExecutionRepository.getHeatmap(accountId, timeRange)
    }

    
}