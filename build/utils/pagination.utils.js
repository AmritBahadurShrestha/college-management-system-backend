"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagination = void 0;
const getPagination = (total, page, limit) => {
    const total_pages = Math.ceil(total / limit);
    const next_page = total_pages > page ? page + 1 : null;
    const prev_page = 1 < page ? page - 1 : null;
    const has_next_page = total_pages > page ? true : false;
    const has_prev_page = page > 1 ? true : false;
    return {
        total,
        total_pages,
        next_page,
        prev_page,
        has_next_page,
        has_prev_page,
    };
};
exports.getPagination = getPagination;
