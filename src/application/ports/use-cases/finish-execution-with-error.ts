export interface FinishExecutionWithError {
	execute(taskExecutionId: string, error: string): Promise<void>
}