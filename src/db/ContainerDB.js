
class ContainerDB {

    constructor(db) {
        this.db = db
    }

    get(id) {

        const query = `
            SELECT c.*, s.id as sId, s.name as sName FROM container AS c 
            LEFT JOIN seller AS s ON c.seller_id = s.id 
            WHERE c.id = ?
        `;

        const stmt = this.db.prepare(query);
        const element = stmt.get(id);
        return element;

    }

    getAll(params) {

        const filters = Array();
        let query = `
            SELECT c.*, s.id as sId, s.name as sName FROM container AS c 
            LEFT JOIN seller AS s ON c.seller_id = s.id 
            WHERE true 
        `;

        if(params.deleted !== null && params.deleted !== '') {
            query += ' AND c.deleted = 0';
        } else {
            query += ' AND c.deleted = 1';
        }

        if(params.content !== null && params.content !== undefined && params.content !== '') {
            query += ' AND c.name like ?';
            filters.push(`%${params.content}%`);
        }

        query += ' ORDER BY c.name';

        const stmt = this.db.prepare(query);

        return stmt.all(filters);

    }

    getCountByFilter(params, filter) {

        const filters = Array();
        let query = `
            SELECT count(*) AS total FROM container
            WHERE true 
        `;

        if(params.deleted !== null && params.deleted !== '') {
            query += ' AND deleted = 0';
        } else {
            query += ' AND deleted = 1';
        }

        if(params.content !== null && params.content !== undefined && params.content !== '') {
            query += ' AND name like ?';
            filters.push(`%${params.content}%`);
        }

        const stmt = this.db.prepare(query);
        const result = stmt.get(filters);
        return result.total;        

    }

    getAllCounts(params) {

        return {
            total: this.getCountByFilter(params)
        }

    }

    save(params) {

        if(params.id && params.id !== '0') {
            return this.update(params);
        }

        return this.insert(params);
        
    }

    insert(params) {

        try {

            const query = `
                INSERT INTO container(name, dimensions, seller_id) 
                VALUES(?, ?, ?)
            `;
            const values = Array();
            values.push(params.name);
            values.push(params.dimensions);
            values.push(params.seller);

            const stmt = this.db.prepare(query);
            const info = stmt.run(values);
            return {
                success: true,
                id: info.lastInsertRowid,
            }

        } catch(err) {
            return {
                error: err.message,
            }
        }

    }

    update(params) {

        try {

            const query = `
                UPDATE container
                set name = ?
                , dimensions = ?
                , seller_id = ?
                , date_update = CURRENT_TIMESTAMP
                WHERE id = ?
            `;
            const values = Array();
            values.push(params.name);
            values.push(params.dimensions);
            values.push(params.seller);
            values.push(params.id);

            const stmt = this.db.prepare(query);
            stmt.run(values);    
            return {
                success: true,
                id: params.id,
            }

        } catch(err) {
            return {
                error: err.message,
            }
        }

    }

    delete(id) {

        try {

            const element = this.get(id);
            if(element) {

                if(element.deleted) {

                    const query = `DELETE FROM container WHERE id = ?`;
                    const stmt = this.db.prepare(query);
                    stmt.run(id);
                    return {
                        success: true,
                    }

                } else {

                    const query = `
                        UPDATE container
                        set deleted = 1
                        , date_delete = CURRENT_TIMESTAMP
                        WHERE id = ?
                    `;
                    const stmt = this.db.prepare(query);
                    stmt.run(id);    
                    return {
                        success: true,
                        id: id,
                    }

                }

            }

        } catch(err) {
            return {
                error: err.message,
            }
            
        }

    }

}


export default ContainerDB;