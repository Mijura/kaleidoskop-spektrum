export type TimeRangeData = {
    startDate: string
    endDate: string
}

export type TaskExecutionHeatmap = {
    date: string
    runCount: number
}

export type PaginationData = {
    pageNumber: number
    pageSize: number
}

export const DefaultPagination: PaginationData = {
    pageNumber: 1,
    pageSize: 5,
}

export enum TaskExecutionStatus {
    RUNNING = 'Running',
    SUCCEEDED = 'Succeeded',
    FAILED = 'Failed'
}