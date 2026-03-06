import { Pagination } from "@application/value-objects/pagination"
import { TaskExecution } from "@domain/task-execution"
import { AuthenticatedUseCase } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export type GetProjectExecutionsUseCaseParams = {
	projectId: string
	pagination: Pagination
}

export type GetProjectExecutionsUseCase = AuthenticatedUseCase<UserData, GetProjectExecutionsUseCaseParams, TaskExecution[]>