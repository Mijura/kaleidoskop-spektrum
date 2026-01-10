import { finishExecutionWithErrorUseCase } from "@infrastructure/dependencies"
import { createFinishExecutionWithErrorHandler } from "@infrastructure/http/factories/finish-execution-with-error"

export const handler = createFinishExecutionWithErrorHandler(finishExecutionWithErrorUseCase)