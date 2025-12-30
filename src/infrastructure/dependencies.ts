
import { FetchTaskExecutionsHeatmap } from "@application/ports/use-cases/fetch-heatmap"
import { FetchTaskExecutionsTimeline } from "@application/ports/use-cases/fetch-timeline"
import { TaskExecutionRepository } from "@application/ports/repositories/task-execution-repository"
import { FetchTaskExecutionsHeatmapUseCase } from "@application/use-cases/fetch-heatmap"
import { FetchTimelineByProjectIdUseCase } from "@application/use-cases/fetch-project-timeline"
import { FetchTimelineByAccountIdUseCase } from "@application/use-cases/fetch-account-timeline"
import { DynamoDBTaskExecutionRepository } from "@infrastructure/repositories/dynamodb-task-execution-repository"

export const taskExecutionRepository: TaskExecutionRepository = new DynamoDBTaskExecutionRepository()

export const fetchTimelineByProjectId: FetchTaskExecutionsTimeline = new FetchTimelineByProjectIdUseCase(taskExecutionRepository)
export const fetchTimelineByAccountId:  FetchTaskExecutionsTimeline = new FetchTimelineByAccountIdUseCase(taskExecutionRepository)
export const fetchTaskExecutionsHeatmap: FetchTaskExecutionsHeatmap = new FetchTaskExecutionsHeatmapUseCase(taskExecutionRepository)