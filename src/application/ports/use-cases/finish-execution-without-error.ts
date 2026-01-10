export interface FinishExecutionWithoutError {
	execute(taskExecutionId: string): Promise<void>
}