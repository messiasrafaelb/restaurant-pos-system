class UserFilter {
    static parseQuery(query = {}){
        const filters = {};

        if (query.name) filters.name = query.name;
        if (query.role) filters.role = query.role;
        if (query.status) filters.status = query.status;
        if (query.createdAt) filters.createdAt = query.createdAt;

        return filters;
    }

    static build(filters = {}){
        let query = `
            SELECT
                U.ID AS id,
                U.NAME AS name,
                U.EMAIL AS email,
                U.ROLE AS role,
                U.STATUS AS status,
                U.CREATED_AT AS created_at
            FROM USERS U
            WHERE 1=1
        `;

        const values = [];

        if (filters.name) {
            values.push(`%${filters.name}%`);
            query += ` AND U.NAME ILIKE $${values.length}`;
        }

        if (filters.role) {
            values.push(`%${filters.role}%`);
            query += ` AND U.ROLE ILIKE $${values.length}`;
        }

        if (filters.status) {
            values.push(`${filters.status}%`);
            query += ` AND U.STATUS ILIKE $${values.length}`;
        }

        if (filters.createdAt) {
            values.push(filters.createdAt);
            query += ` AND DATE(U.CREATED_AT) = DATE($${values.length})`;
        }

        return { query, values };
    }
}

module.exports = UserFilter;
