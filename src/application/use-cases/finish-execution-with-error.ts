import { TaskExecutionRepository } from "@application/ports/repositories/task-execution-repository"
import { FinishExecutionWithError } from "@application/ports/use-cases/finish-execution-with-error"

export class FinishExecutionWithErrorUseCase implements FinishExecutionWithError {
	constructor(private readonly taskExecutionRepository: TaskExecutionRepository) {}

	async execute(taskExecutionId: string, error: string): Promise<void> {
		const taskExecution = await this.taskExecutionRepository.get(taskExecutionId)
        if (!taskExecution) {
            throw new Error("Task execution not found")
        }
		taskExecution.finishWithError(error)
		await this.taskExecutionRepository.save(taskExecution)
	}
}