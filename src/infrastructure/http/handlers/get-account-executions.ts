import { GetAccountExecutionsUseCase } from "@application/ports/use-cases/get-account-executions"
import { GetAccountExecutions } from "@application/use-cases/get-account-executions"
import { createGetAccountExecutionsHandler } from "@infrastructure/http/factories/get-account-executions"
import { taskExecutionRepository } from "@infrastructure/repositories/task-execution-repository"

const getAccountExecutionsUseCase: GetAccountExecutionsUseCase = new GetAccountExecutions(taskExecutionRepository)

export const handler = createGetAccountExecutionsHandler(getAccountExecutionsUseCase)
