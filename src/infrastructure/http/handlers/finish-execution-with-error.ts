import { FinishExecutionWithErrorUseCase } from "@application/ports/use-cases/finish-execution-with-error"
import { FinishExecutionWithError } from "@application/use-cases/finish-execution-with-error"
import { createFinishExecutionWithErrorHandler } from "@infrastructure/http/factories/finish-execution-with-error"
import { taskExecutionRepository } from "@infrastructure/repositories/task-execution-repository"

const finishExecutionWithErrorUseCase: FinishExecutionWithErrorUseCase = new FinishExecutionWithError(
	taskExecutionRepository,
)

export const handler = createFinishExecutionWithErrorHandler(finishExecutionWithErrorUseCase)
