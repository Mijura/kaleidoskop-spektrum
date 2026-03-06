import { v4 as uuidv4 } from "uuid"
import { TaskExecutionStatus } from "@domain/task-execution-status"
export class TaskExecution {
	public readonly id: string
	public title: string
	public readonly projectId: string
	public readonly taskId: string
	public readonly accountId: string
	public status: TaskExecutionStatus
	public occurredAt: string
	public error?: string

	constructor(
		id: string,
		title: string,
		projectId: string,
		taskId: string,
		accountId: string,
		status: TaskExecutionStatus,
		occurredAt: string,
		error?: string,
	) {
		this.id = id
		this.projectId = projectId
		this.taskId = taskId
		this.accountId = accountId
		this.title = title
		this.status = status
		this.occurredAt = occurredAt
		this.error = error
	}

	static create(title: string, projectId: string, taskId: string, accountId: string): TaskExecution {
		const id = uuidv4()
		const occurredAt = new Date().toISOString()
		const status = TaskExecutionStatus.RUNNING

		const execution = new TaskExecution(id, title, projectId, taskId, accountId, status, occurredAt)

		return execution
	}

	finishSuccessfully(): void {
		this.status = TaskExecutionStatus.SUCCEEDED
	}

	finishWithError(error: string): void {
		this.status = TaskExecutionStatus.FAILED
		this.error = error
	}
}
