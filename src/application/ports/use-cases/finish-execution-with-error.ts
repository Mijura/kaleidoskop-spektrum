export interface FinishExecutionWithErrorUseCase {
	execute(taskExecutionId: string, error: string): Promise<void>
}
