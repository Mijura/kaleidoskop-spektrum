import { GetExecutionHeatmapUseCase } from "@application/ports/use-cases/get-execution-heatmap"
import { GetExecutionHeatmap } from "@application/use-cases/get-execution-heatmap"
import { createGetExecutionHeatmapHandler } from "@infrastructure/http/factories/get-execution-heatmap"
import { taskExecutionRepository } from "@infrastructure/repositories/task-execution-repository"

const getExecutionHeatmapUseCase: GetExecutionHeatmapUseCase = new GetExecutionHeatmap(taskExecutionRepository)

export const handler = createGetExecutionHeatmapHandler(getExecutionHeatmapUseCase)
