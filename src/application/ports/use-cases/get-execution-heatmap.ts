import { TimeRangeDTO } from "@application/dto/time-range"
import { HeatmapDTO } from "@application/dto/heatmap"

export interface GetExecutionHeatmap {
    execute(accountId: string, timeRange: TimeRangeDTO): Promise<HeatmapDTO[]>
}