import { createGetProjectExecutionsHandler } from "@infrastructure/http/factories/get-project-executions"
import { getProjectExecutionsUseCase } from "@infrastructure/dependencies"

export const handler = createGetProjectExecutionsHandler(getProjectExecutionsUseCase)
