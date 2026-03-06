import { TaskExecutionRepository } from "@application/ports/repositories/task-execution-repository"
import { FinishExecutionWithoutErrorUseCase, FinishExecutionWithoutErrorUseCaseParams } from "@application/ports/use-cases/finish-execution-without-error"
import { Auth } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export class FinishExecutionWithoutError implements FinishExecutionWithoutErrorUseCase {
	constructor(private readonly taskExecutionRepository: TaskExecutionRepository) {}

	async execute(auth: Auth<UserData>, params: FinishExecutionWithoutErrorUseCaseParams): Promise<void> {
		console.log(`Auth data: ${JSON.stringify(auth)}`)
		const { taskExecutionId } = params
		const taskExecution = await this.taskExecutionRepository.get(taskExecutionId)
		if (!taskExecution) {
			throw new Error("Task execution not found")
		}
		taskExecution.finishSuccessfully()
		await this.taskExecutionRepository.save(taskExecution)
	}
}
