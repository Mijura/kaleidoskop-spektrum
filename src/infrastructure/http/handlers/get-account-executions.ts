import { getAccountExecutionsUseCase } from "@infrastructure/dependencies"
import { createGetAccountExecutionsHandler } from "@infrastructure/http/factories/get-account-executions"

export const handler = createGetAccountExecutionsHandler(getAccountExecutionsUseCase)
