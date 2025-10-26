export interface PaginationOptions {
    page?: number;
    limit?: number;
}
export interface DateFilterOptions {
    month?: number;
    year?: number;
    dateField?: string;
}
export interface SearchOptions {
    search?: string;
    searchFields?: string[];
}
export interface QueryBuilderOptions extends PaginationOptions, DateFilterOptions, SearchOptions {
    additionalFilters?: Record<string, any>;
}
export declare class QueryBuilderUtil {
    static buildPagination(options: PaginationOptions): {
        offset: number;
        limit: number;
        pagination: {
            currentPage: number;
            itemsPerPage: number;
        };
    };
    static buildDateFilter(options: DateFilterOptions): Record<string, any>;
    static buildSearchFilter(options: SearchOptions): Record<string, any>;
    static buildWhereClause(options: QueryBuilderOptions): Record<string, any>;
    static buildPaginationResponse(total: number, pagination: {
        currentPage: number;
        itemsPerPage: number;
    }): {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
    static buildQuery(options: QueryBuilderOptions): {
        where: Record<string, any>;
        offset: number;
        limit: number;
        pagination: {
            currentPage: number;
            itemsPerPage: number;
        };
    };
}
