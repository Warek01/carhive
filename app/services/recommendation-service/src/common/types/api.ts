export interface PaginatedResponse<T> {
   items: T[];
   page: number;
   totalItems: number;
}
