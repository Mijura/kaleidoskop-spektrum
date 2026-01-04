import { getExecutionHeatmapUseCase } from "@infrastructure/dependencies"
import { createGetExecutionHeatmapHandler } from "@infrastructure/http/factories/get-execution-heatmap"

export const handler = createGetExecutionHeatmapHandler(getExecutionHeatmapUseCase)
