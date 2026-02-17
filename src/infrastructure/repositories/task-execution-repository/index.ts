import { TaskExecutionRepository } from "@application/ports/repositories/task-execution-repository"
import { DynamoDBTaskExecutionRepository } from "./dynamodb-task-execution-repository"

export const taskExecutionRepository: TaskExecutionRepository = new DynamoDBTaskExecutionRepository()
