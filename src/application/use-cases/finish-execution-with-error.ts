import { TaskExecutionRepository } from "@application/ports/repositories/task-execution-repository"
import { FinishExecutionWithErrorUseCase, FinishExecutionWithErrorUseCaseParams } from "@application/ports/use-cases/finish-execution-with-error"
import { Auth } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export class FinishExecutionWithError implements FinishExecutionWithErrorUseCase {
	constructor(private readonly taskExecutionRepository: TaskExecutionRepository) {}

	async execute(auth: Auth<UserData>, params: FinishExecutionWithErrorUseCaseParams): Promise<void> {

		console.log(`Auth data: ${JSON.stringify(auth)}`)
		const { taskExecutionId, error } = params
		const taskExecution = await this.taskExecutionRepository.get(taskExecutionId)
		if (!taskExecution) {
			throw new Error("Task execution not found")
		}
		taskExecution.finishWithError(error)
		await this.taskExecutionRepository.save(taskExecution)
	}
}
