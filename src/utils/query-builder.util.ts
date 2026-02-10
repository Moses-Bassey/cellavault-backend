import { Op } from 'sequelize';

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

export interface QueryBuilderOptions
  extends PaginationOptions,
    DateFilterOptions,
    SearchOptions {
  additionalFilters?: Record<string, any>;
}

export class QueryBuilderUtil {
  /**
   * Builds pagination parameters for Sequelize queries
   */
  static buildPagination(options: PaginationOptions) {
    const { page = 1, limit = 10 } = options;
    const offset = (page - 1) * limit;

    return {
      offset,
      limit,
      pagination: {
        currentPage: page,
        itemsPerPage: limit,
      },
    };
  }

  /**
   * Builds date range filter for Sequelize queries
   */
  static buildDateFilter(options: DateFilterOptions): Record<string, any> {
    const { month, year, dateField = 'createdAt' } = options;

    if (!month && !year) {
      return {};
    }

    let startDate: Date;
    let endDate: Date;

    if (month && year) {
      // Filter by specific month and year
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0, 23, 59, 59, 999);
    } else if (month) {
      // Filter by month only (current year)
      const currentYear = new Date().getFullYear();
      startDate = new Date(currentYear, month - 1, 1);
      endDate = new Date(currentYear, month, 0, 23, 59, 59, 999);
    } else if (year) {
      // Filter by year only
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 11, 31, 23, 59, 59, 999);
    } else {
      return {};
    }

    return {
      [dateField]: {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      },
    };
  }

  /**
   * Builds search filter for Sequelize queries
   */
  static buildSearchFilter(options: SearchOptions): Record<string, any> {
    const { search, searchFields = ['email'] } = options;

    if (!search) {
      return {};
    }

    return {
      [Op.or]: searchFields.map((field) => ({
        [field]: {
          [Op.iLike]: `%${search}%`,
        },
      })),
    };
  }

  /**
   * Builds complete where clause for Sequelize queries
   */
  static buildWhereClause(options: QueryBuilderOptions): Record<string, any> {
    const { additionalFilters = {} } = options;

    const where: any = {
      ...additionalFilters,
      ...this.buildDateFilter(options),
      ...this.buildSearchFilter(options),
    };

    // Remove empty objects
    Object.keys(where).forEach((key) => {
      if (
        where[key] &&
        typeof where[key] === 'object' &&
        Object.keys(where[key]).length === 0
      ) {
        delete where[key];
      }
    });

    return where;
  }

  /**
   * Builds pagination response metadata
   */
  static buildPaginationResponse(
    total: number,
    pagination: { currentPage: number; itemsPerPage: number },
  ) {
    const { currentPage, itemsPerPage } = pagination;
    const totalPages = Math.ceil(total / itemsPerPage);

    return {
      currentPage,
      totalPages,
      totalItems: total,
      itemsPerPage,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    };
  }

  /**
   * Complete query builder that returns all necessary parameters for Sequelize queries
   */
  static buildQuery(options: QueryBuilderOptions) {
    const pagination = this.buildPagination(options);
    const where = this.buildWhereClause(options);

    return {
      where,
      offset: pagination.offset,
      limit: pagination.limit,
      pagination: pagination.pagination,
    };
  }
}
