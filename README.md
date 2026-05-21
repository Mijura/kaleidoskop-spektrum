# kaleidoskop-spektrum

> **Note:** this service used to be named `kaleidoskop`. The name was
> handed off to the JigJoy platform replay tool
> (https://github.com/jigjoy-ai/kaleidoskop) in May 2026; this repo
> continues to back the Spektrum platform's observability needs.

Spektrum platform observability microservice — tracks task execution
timelines via Lambda + DynamoDB. CloudFormation stack name is still
`spektrum-observability` (unchanged so platform-serverless-api imports
keep working).

![kaleidoskop](https://github.com/user-attachments/assets/5147ad6a-9596-49ce-ab08-feb9f93f5808)

## Architecture

Serverless microservice built with AWS SAM using Clean Architecture (Hexagonal / Ports & Adapters).

**AWS Resources:**
- 6 Lambda functions (Node.js 22.x, 128MB, esbuild-bundled)
- 1 DynamoDB table (`TaskExecution`) with 2 GSIs (`projectTimelineGSI`, `accountTimelineGSI`)
- IAM roles with `DynamoDBCrudPolicy` per function

**Lambda Functions:**
| Function | Description |
|----------|-------------|
| StartTaskExecution | Start a new task execution |
| FinishExecutionWithoutError | Mark execution as succeeded |
| FinishExecutionWithError | Mark execution as failed |
| GetProjectExecutions | Fetch timeline by project |
| GetAccountExecutions | Fetch timeline by account |
| GetExecutionHeatmap | Fetch execution heatmap |

All function ARNs are exported via CloudFormation outputs for use by `platform-serverless-api`.

## Prerequisites

- Node.js 22.x
- AWS SAM CLI
- AWS CLI configured with `spektrum-dev` profile

## Setup

```bash
npm install
```

### GitHub Packages

This project depends on `@jigjoy-ai/serverless-core` from GitHub Packages. You need a `.npmrc` file in the project root:

```
@jigjoy-ai:registry=https://npm.pkg.github.com
```

Your global `~/.npmrc` must have a GitHub PAT with `read:packages` scope:

```
//npm.pkg.github.com/:_authToken=<your-github-pat>
```

### Environment Variables for Tests

Create a `.env.test` file in the project root (gitignored):

```
AWS_REGION="eu-west-1"
TASK_EXECUTION_TABLE="TaskExecution"
```

## Running Tests

```bash
# Unit tests only (no AWS credentials needed)
npm test

# All tests including DynamoDB integration tests (requires AWS credentials + deployed stack)
AWS_PROFILE=spektrum-dev npm test

# Coverage report
npm run coverage
```

**Test breakdown:**
- Domain tests: task execution entity and status validation
- Application tests: use cases with in-memory repository mocks
- Infrastructure HTTP tests: handler request/response validation
- Infrastructure repository tests: DynamoDB integration (requires deployed table)

## Build

```bash
# Ensure esbuild is on PATH
PATH=$PWD/node_modules/.bin:$PATH sam build --profile spektrum-dev
```

## Deploy

**Stack name:** `spektrum-observability`
**Region:** `eu-west-1`
**Profile:** `spektrum-dev`

```bash
sam deploy --profile spektrum-dev --no-confirm-changeset --capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND
```

Or using npm scripts:

```bash
npm run build:dev
npm run deploy:dev
```

## Local Development

```bash
# Build and serve locally on port 9000
npm run build:local
npm run serve:local

# API docs on port 9090
npm run docs

# Both in parallel
npm run dev
```

Local development requires an `env.json` file with Lambda environment variables (gitignored).

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/task-execution/started` | Start a task execution |
| POST | `/task-execution/finished` | Finish execution (success) |
| POST | `/task-execution/finished-with-error` | Finish execution (error) |
| GET | `/task-execution/project/{projectId}` | Get project timeline |
| GET | `/task-execution/account/{accountId}` | Get account timeline |
| GET | `/task-execution/heatmap/account/{accountId}` | Get execution heatmap |
