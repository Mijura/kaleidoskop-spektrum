import { TaskExecutionRepository } from "@application/ports/repositories/task-execution-repository"
import { GetExecutionHeatmapUseCase, GetExecutionHeatmapUseCaseParams } from "@application/ports/use-cases/get-execution-heatmap"
import { Heatmap } from "@application/value-objects/heatmap"
import { Auth } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export class GetExecutionHeatmap implements GetExecutionHeatmapUseCase {
	constructor(private readonly taskExecutionRepository: TaskExecutionRepository) {}

	async execute(auth: Auth<UserData>, params: GetExecutionHeatmapUseCaseParams): Promise<Heatmap[]> {
		console.log(`Auth data: ${JSON.stringify(auth)}`)
		const { timeRange } = params
		return await this.taskExecutionRepository.getHeatmap(auth.data.userId, timeRange)
	}
}
