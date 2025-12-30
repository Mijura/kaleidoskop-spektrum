import { TaskExecutionDTO } from "@application/dto/task-execution"
import { TaskExecution } from "@domain/task-execution"

export class TaskExecutionMapper {
    static toDTO(taskExecution: TaskExecution): TaskExecutionDTO {
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

    static toDTOs(taskExecutions: TaskExecution[]): TaskExecutionDTO[] {
        return taskExecutions.map(taskExecution => this.toDTO(taskExecution))
    }
}