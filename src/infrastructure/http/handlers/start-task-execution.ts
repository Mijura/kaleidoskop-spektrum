import { createStartTaskExecutionHandler } from "@infrastructure/http/factories/start-task-execution"
import { startTaskExecutionUseCase } from "@infrastructure/dependencies"

export const handler = createStartTaskExecutionHandler(startTaskExecutionUseCase)