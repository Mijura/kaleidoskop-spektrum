import { GetExecutionHeatmap } from "@application/ports/use-cases/get-execution-heatmap"
import { GetAccountExecutions } from "@application/ports/use-cases/get-account-executions"
import { TaskExecutionRepository } from "@application/ports/repositories/task-execution-repository"
import { DynamoDBTaskExecutionRepository } from "@infrastructure/repositories/dynamodb-task-execution-repository"
import { GetProjectExecutions } from "@application/ports/use-cases/get-project-executions"
import { GetProjectExecutionsUseCase } from "@application/use-cases/get-project-executions"
import { GetAccountExecutionsUseCase } from "@application/use-cases/get-account-executions"
import { GetExecutionHeatmapUseCase } from "@application/use-cases/get-execution-heatmap"
import { StartTaskExecution } from "@application/ports/use-cases/start-task-execution"
import { StartTaskExecutionUseCase } from "@application/use-cases/start-task-execution"
import { FinishExecutionWithError } from "@application/ports/use-cases/finish-execution-with-error"
import { FinishExecutionWithErrorUseCase } from "@application/use-cases/finish-execution-with-error"
import { FinishExecutionWithoutError } from "@application/ports/use-cases/finish-execution-without-error"
import { FinishExecutionWithoutErrorUseCase } from "@application/use-cases/finish-execution-without-error"

export const taskExecutionRepository: TaskExecutionRepository = new DynamoDBTaskExecutionRepository()

// Use Cases
export const getProjectExecutionsUseCase: GetProjectExecutions = new GetProjectExecutionsUseCase(
	taskExecutionRepository,
)
export const getAccountExecutionsUseCase: GetAccountExecutions = new GetAccountExecutionsUseCase(
	taskExecutionRepository,
)
export const getExecutionHeatmapUseCase: GetExecutionHeatmap = new GetExecutionHeatmapUseCase(taskExecutionRepository)
export const startTaskExecutionUseCase: StartTaskExecution = new StartTaskExecutionUseCase(taskExecutionRepository)
export const finishExecutionWithErrorUseCase: FinishExecutionWithError = new FinishExecutionWithErrorUseCase(taskExecutionRepository)
export const finishExecutionWithoutErrorUseCase: FinishExecutionWithoutError = new FinishExecutionWithoutErrorUseCase(taskExecutionRepository)