import { TaskExecution } from "@domain/task-execution"
import { TaskExecutionRecord } from "@infrastructure/repositories/records/task-execution"

export class TaskExecutionMapper {
	static toRecord(taskExecution: TaskExecution): TaskExecutionRecord {
		return {
			id: taskExecution.id,
			title: taskExecution.title,
			projectId: taskExecution.projectId,
			taskId: taskExecution.taskId,
			accountId: taskExecution.accountId,
			status: taskExecution.status,
			occurredAt: taskExecution.occurredAt,
			error: taskExecution.error,
		}
	}

	static toDomain(record: TaskExecutionRecord): TaskExecution {
		return new TaskExecution(
			record.id,
			record.title,
			record.projectId,
			record.taskId,
			record.accountId,
			record.status,
			record.occurredAt,
			record.error,
		)
	}

	static toDomains(records: TaskExecutionRecord[]): TaskExecution[] {
		return records.map((record) => this.toDomain(record))
	}
}
