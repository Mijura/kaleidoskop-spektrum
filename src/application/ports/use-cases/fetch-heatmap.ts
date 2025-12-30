import { TimeRangeDTO } from "@application/dto/time-range"
import { HeatmapDTO } from "@application/dto/heatmap"

export interface FetchTaskExecutionsHeatmap {
    execute(accountId: string, timeRange: TimeRangeDTO): Promise<HeatmapDTO[]>
}