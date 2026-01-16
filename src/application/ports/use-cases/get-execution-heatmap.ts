import { Heatmap } from "@application/value-objects/heatmap"
import { TimeRange } from "@application/value-objects/time-range"

export interface GetExecutionHeatmapUseCase {
	execute(accountId: string, timeRange: TimeRange): Promise<Heatmap[]>
}
