import { Heatmap } from "@application/value-objects/heatmap"
import { TimeRange } from "@application/value-objects/time-range"

export interface GetExecutionHeatmap {
	execute(accountId: string, timeRange: TimeRange): Promise<Heatmap[]>
}
