import { Pagination } from "@application/value-objects/pagination"
import { TaskExecution } from "@domain/task-execution"
import { AuthenticatedUseCase } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export type GetAccountExecutionsUseCaseParams = {
	pagination: Pagination
}

export type GetAccountExecutionsUseCase = AuthenticatedUseCase<UserData, GetAccountExecutionsUseCaseParams, TaskExecution[]>
