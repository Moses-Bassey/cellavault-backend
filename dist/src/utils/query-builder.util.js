"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilderUtil = void 0;
const sequelize_1 = require("sequelize");
class QueryBuilderUtil {
    static buildPagination(options) {
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
    static buildDateFilter(options) {
        const { month, year, dateField = 'createdAt' } = options;
        if (!month && !year) {
            return {};
        }
        let startDate;
        let endDate;
        if (month && year) {
            startDate = new Date(year, month - 1, 1);
            endDate = new Date(year, month, 0, 23, 59, 59, 999);
        }
        else if (month) {
            const currentYear = new Date().getFullYear();
            startDate = new Date(currentYear, month - 1, 1);
            endDate = new Date(currentYear, month, 0, 23, 59, 59, 999);
        }
        else if (year) {
            startDate = new Date(year, 0, 1);
            endDate = new Date(year, 11, 31, 23, 59, 59, 999);
        }
        else {
            return {};
        }
        return {
            [dateField]: {
                [sequelize_1.Op.gte]: startDate,
                [sequelize_1.Op.lte]: endDate,
            },
        };
    }
    static buildSearchFilter(options) {
        const { search, searchFields = ['email'] } = options;
        if (!search) {
            return {};
        }
        return {
            [sequelize_1.Op.or]: searchFields.map((field) => ({
                [field]: {
                    [sequelize_1.Op.iLike]: `%${search}%`,
                },
            })),
        };
    }
    static buildWhereClause(options) {
        const { additionalFilters = {} } = options;
        const where = {
            ...additionalFilters,
            ...this.buildDateFilter(options),
            ...this.buildSearchFilter(options),
        };
        Object.keys(where).forEach((key) => {
            if (where[key] &&
                typeof where[key] === 'object' &&
                Object.keys(where[key]).length === 0) {
                delete where[key];
            }
        });
        return where;
    }
    static buildPaginationResponse(total, pagination) {
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
    static buildQuery(options) {
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
exports.QueryBuilderUtil = QueryBuilderUtil;
//# sourceMappingURL=query-builder.util.js.map