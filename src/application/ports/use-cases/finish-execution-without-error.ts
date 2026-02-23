import { AuthenticatedUseCase } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export type FinishExecutionWithoutErrorUseCaseParams = {
	taskExecutionId: string
}

export type FinishExecutionWithoutErrorUseCase = AuthenticatedUseCase<UserData, FinishExecutionWithoutErrorUseCaseParams, void>