import { AuthenticatedUseCase } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export type FinishExecutionWithErrorUseCaseParams = {
	taskExecutionId: string
	error: string
}

export type FinishExecutionWithErrorUseCase = AuthenticatedUseCase<UserData, FinishExecutionWithErrorUseCaseParams, void>