import { TaskExecution } from "@domain/task-execution"
import { AuthenticatedUseCase } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export type StartTaskExecutionUseCaseParams = {
	title: string
	projectId: string
	taskId: string
}

export type StartTaskExecutionUseCase = AuthenticatedUseCase<UserData, StartTaskExecutionUseCaseParams, TaskExecution>