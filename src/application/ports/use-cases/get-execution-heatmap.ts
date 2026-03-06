import { Heatmap } from "@application/value-objects/heatmap"
import { TimeRange } from "@application/value-objects/time-range"
import { AuthenticatedUseCase } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export type GetExecutionHeatmapUseCaseParams = {
	timeRange: TimeRange
}

export type GetExecutionHeatmapUseCase = AuthenticatedUseCase<UserData, GetExecutionHeatmapUseCaseParams, Heatmap[]>