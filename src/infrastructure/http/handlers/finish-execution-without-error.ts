import { finishExecutionWithoutErrorUseCase } from "@infrastructure/dependencies"
import { createFinishExecutionWithoutErrorHandler } from "@infrastructure/http/factories/finish-execution-without-error"

export const handler = createFinishExecutionWithoutErrorHandler(finishExecutionWithoutErrorUseCase)