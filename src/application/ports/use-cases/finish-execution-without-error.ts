export interface FinishExecutionWithoutErrorUseCase {
	execute(taskExecutionId: string): Promise<void>
}
