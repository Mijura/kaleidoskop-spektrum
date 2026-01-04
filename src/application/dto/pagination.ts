export type PaginationDTO = {
	pageNumber: number
	pageSize: number
}

export const DefaultPagination: PaginationDTO = {
	pageNumber: 1,
	pageSize: 5,
}
