
import { FetchTaskExecutionsHeatmap } from "@domain/use-cases/fetch-heatmap"
import { FetchTaskExecutionsTimeline } from "@domain/use-cases/fetch-timeline"
import { TaskExecutionRepository } from "@domain/ports/repositories/task-execution-repository"
import { FetchTaskExecutionsHeatmapUseCase } from "@application/use-cases/fetch-heatmap"
import { FetchTimelineByProjectIdUseCase } from "@application/use-cases/fetch-project-timeline"
import { FetchTimelineByAccountIdUseCase } from "@application/use-cases/fetch-account-timeline"
import { DynamoDBTaskExecutionRepository } from "@infrastructure/adapters/repositories/dynamodb-task-execution-repository"

export const taskExecutionRepository: TaskExecutionRepository = new DynamoDBTaskExecutionRepository()

export const fetchTimelineByProjectId: FetchTaskExecutionsTimeline = new FetchTimelineByProjectIdUseCase(taskExecutionRepository)
export const fetchTimelineByAccountId:  FetchTaskExecutionsTimeline = new FetchTimelineByAccountIdUseCase(taskExecutionRepository)
export const fetchTaskExecutionsHeatmap: FetchTaskExecutionsHeatmap = new FetchTaskExecutionsHeatmapUseCase(taskExecutionRepository)