import { GetProjectExecutionsUseCase } from "@application/ports/use-cases/get-project-executions"
import { GetProjectExecutions } from "@application/use-cases/get-project-executions"
import { createGetProjectExecutionsHandler } from "@infrastructure/http/factories/get-project-executions"
import { taskExecutionRepository } from "@infrastructure/repositories/task-execution-repository"

const getProjectExecutionsUseCase: GetProjectExecutionsUseCase = new GetProjectExecutions(taskExecutionRepository)

export const handler = createGetProjectExecutionsHandler(getProjectExecutionsUseCase)
