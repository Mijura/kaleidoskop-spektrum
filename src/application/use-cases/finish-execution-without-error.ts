import { TaskExecutionRepository } from "@application/ports/repositories/task-execution-repository"
import { FinishExecutionWithoutError } from "@application/ports/use-cases/finish-execution-without-error"

export class FinishExecutionWithoutErrorUseCase implements FinishExecutionWithoutError {
	constructor(private readonly taskExecutionRepository: TaskExecutionRepository) {}

	async execute(taskExecutionId: string): Promise<void> {
		const taskExecution = await this.taskExecutionRepository.get(taskExecutionId)
		if (!taskExecution) {
			throw new Error("Task execution not found")
		}
		taskExecution.finishSuccessfully()
		await this.taskExecutionRepository.save(taskExecution)
	}
}