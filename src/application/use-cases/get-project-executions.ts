import { TaskExecution } from "@domain/task-execution"
import { TaskExecutionRepository } from "@application/ports/repositories/task-execution-repository"
import { GetProjectExecutions } from "@application/ports/use-cases/get-project-executions"
import { Pagination } from "@application/value-objects/pagination"

export class GetProjectExecutionsUseCase implements GetProjectExecutions {
	constructor(private readonly taskExecutionRepository: TaskExecutionRepository) {}

	async execute(projectId: string, pagination: Pagination): Promise<TaskExecution[]> {
		const taskExecutions: TaskExecution[] = await this.taskExecutionRepository.getTimelineByProjectId(
			projectId,
			pagination,
		)
		return taskExecutions
	}
}
