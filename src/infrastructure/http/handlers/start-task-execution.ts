import { StartTaskExecutionUseCase } from "@application/ports/use-cases/start-task-execution"
import { StartTaskExecution } from "@application/use-cases/start-task-execution"
import { createStartTaskExecutionHandler } from "@infrastructure/http/factories/start-task-execution"
import { taskExecutionRepository } from "@infrastructure/repositories/task-execution-repository"

const startTaskExecutionUseCase: StartTaskExecutionUseCase = new StartTaskExecution(taskExecutionRepository)

export const handler = createStartTaskExecutionHandler(startTaskExecutionUseCase)
