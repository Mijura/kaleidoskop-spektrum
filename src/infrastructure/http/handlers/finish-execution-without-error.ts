import { createFinishExecutionWithoutErrorHandler } from "@infrastructure/http/factories/finish-execution-without-error"
import { FinishExecutionWithoutErrorUseCase } from "@application/ports/use-cases/finish-execution-without-error"
import { FinishExecutionWithoutError } from "@application/use-cases/finish-execution-without-error"
import { taskExecutionRepository } from "@infrastructure/repositories/task-execution-repository"

const finishExecutionWithoutErrorUseCase: FinishExecutionWithoutErrorUseCase = new FinishExecutionWithoutError(
	taskExecutionRepository,
)

export const handler = createFinishExecutionWithoutErrorHandler(finishExecutionWithoutErrorUseCase)
