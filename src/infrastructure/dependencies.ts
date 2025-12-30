import { GetExecutionHeatmap } from "@application/ports/use-cases/get-execution-heatmap"
import { GetAccountExecutions } from "@application/ports/use-cases/get-account-executions"
import { TaskExecutionRepository } from "@application/ports/repositories/task-execution-repository"
import { DynamoDBTaskExecutionRepository } from "@infrastructure/repositories/dynamodb-task-execution-repository"
import { GetProjectExecutions } from "@application/ports/use-cases/get-project-executions"
import { GetProjectExecutionsUseCase } from "@application/use-cases/get-project-executions"
import { GetAccountExecutionsUseCase } from "@application/use-cases/get-account-executions"
import { GetExecutionHeatmapUseCase } from "@application/use-cases/get-execution-heatmap"

export const taskExecutionRepository: TaskExecutionRepository = new DynamoDBTaskExecutionRepository()

// Use Cases
export const getProjectExecutionsUseCase: GetProjectExecutions = new GetProjectExecutionsUseCase(taskExecutionRepository)
export const getAccountExecutionsUseCase: GetAccountExecutions = new GetAccountExecutionsUseCase(taskExecutionRepository)
export const getExecutionHeatmapUseCase: GetExecutionHeatmap = new GetExecutionHeatmapUseCase(taskExecutionRepository)