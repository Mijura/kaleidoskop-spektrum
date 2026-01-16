import { TaskExecutionRepository } from "@application/ports/repositories/task-execution-repository"
import { GetExecutionHeatmapUseCase } from "@application/ports/use-cases/get-execution-heatmap"
import { Heatmap } from "@application/value-objects/heatmap"
import { TimeRange } from "@application/value-objects/time-range"

export class GetExecutionHeatmap implements GetExecutionHeatmapUseCase {
	constructor(private readonly taskExecutionRepository: TaskExecutionRepository) {}

	async execute(accountId: string, timeRange: TimeRange): Promise<Heatmap[]> {
		return await this.taskExecutionRepository.getHeatmap(accountId, timeRange)
	}
}
