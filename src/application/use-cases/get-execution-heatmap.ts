import { TaskExecutionRepository } from "@application/ports/repositories/task-execution-repository"
import { GetExecutionHeatmap } from "@application/ports/use-cases/get-execution-heatmap"
import { Heatmap } from "@application/value-objects/heatmap"
import { TimeRange } from "@application/value-objects/time-range"

export class GetExecutionHeatmapUseCase implements GetExecutionHeatmap {
	constructor(private readonly taskExecutionRepository: TaskExecutionRepository) {}

	async execute(accountId: string, timeRange: TimeRange): Promise<Heatmap[]> {
		return await this.taskExecutionRepository.getHeatmap(accountId, timeRange)
	}
}
