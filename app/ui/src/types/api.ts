export interface PaginatedResponse<T> {
   items: T[];
   totalItems: number;
   itemsPerPage: number;
   page: number;
}

export interface PaginatedRequest {
   offset: number;
   limit: number;
}

export interface PaginationControl {
   page: number;
   itemsPerPage: number;
   totalItems?: number;
}
