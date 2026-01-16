import { TaskExecutionRepository } from "@application/ports/repositories/task-execution-repository"
import { GetAccountExecutionsUseCase } from "@application/ports/use-cases/get-account-executions"
import { GetProjectExecutionsUseCase } from "@application/ports/use-cases/get-project-executions"
import { GetExecutionHeatmapUseCase } from "@application/ports/use-cases/get-execution-heatmap"
import { StartTaskExecutionUseCase } from "@application/ports/use-cases/start-task-execution"
import { FinishExecutionWithErrorUseCase } from "@application/ports/use-cases/finish-execution-with-error"
import { FinishExecutionWithoutErrorUseCase } from "@application/ports/use-cases/finish-execution-without-error"
import { DynamoDBTaskExecutionRepository } from "@infrastructure/repositories/dynamodb-task-execution-repository"
import { GetProjectExecutions } from "@application/use-cases/get-project-executions"
import { GetAccountExecutions } from "@application/use-cases/get-account-executions"
import { GetExecutionHeatmap } from "@application/use-cases/get-execution-heatmap"
import { StartTaskExecution } from "@application/use-cases/start-task-execution"
import { FinishExecutionWithError } from "@application/use-cases/finish-execution-with-error"
import { FinishExecutionWithoutError } from "@application/use-cases/finish-execution-without-error"

export const taskExecutionRepository: TaskExecutionRepository = new DynamoDBTaskExecutionRepository()

// Use Cases
export const getProjectExecutionsUseCase: GetProjectExecutionsUseCase = new GetProjectExecutions(
	taskExecutionRepository,
)
export const getAccountExecutionsUseCase: GetAccountExecutionsUseCase = new GetAccountExecutions(
	taskExecutionRepository,
)
export const getExecutionHeatmapUseCase: GetExecutionHeatmapUseCase = new GetExecutionHeatmap(taskExecutionRepository)
export const startTaskExecutionUseCase: StartTaskExecutionUseCase = new StartTaskExecution(taskExecutionRepository)
export const finishExecutionWithErrorUseCase: FinishExecutionWithErrorUseCase = new FinishExecutionWithError(
	taskExecutionRepository,
)
export const finishExecutionWithoutErrorUseCase: FinishExecutionWithoutErrorUseCase = new FinishExecutionWithoutError(
	taskExecutionRepository,
)
