
class SellerDB {

    static TB_NAME = 'seller';

    constructor(db) {
        this.db = db
    }

    get(id) {

        const query = `
            SELECT * FROM ${this.constructor.TB_NAME} 
            WHERE id = ?
        `;

        const stmt = this.db.prepare(query);
        const element = stmt.get(id);
        return element;

    }

    getAll(params) {

        const filters = Array();
        let query = `
            SELECT * FROM ${this.constructor.TB_NAME} 
            WHERE deleted = 0 
        `;

        if(params) {

            if(params.content !== null && params.content !== undefined && params.content !== '') {
                query += ' AND name like ?';
                filters.push(`%${params.content}%`);
            }

            if(params.description !== null && params.description !== undefined && params.description !== '') {
                query += ' AND description like ?';
                filters.push(`%${params.description}%`);
            }

        }

        query += ' ORDER BY name';

        const stmt = this.db.prepare(query);

        return stmt.all(filters);

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
                INSERT INTO ${this.constructor.TB_NAME}(
                    name
                    , short_description
                    , description
                    , website
                    , email
                    , phone_number
                    , address
                    , city
                    , postal_code
                    , state
                    , country
                ) 
                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const values = Array();
            values.push(params.name);
            values.push(params.shortDescription);
            values.push(params.description);
            values.push(params.website);
            values.push(params.email);
            values.push(params.phoneNumber);
            values.push(params.address);
            values.push(params.city);
            values.push(params.postalCode);
            values.push(params.state);
            values.push(params.country);

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
                UPDATE ${this.constructor.TB_NAME}
                set name = ?
                , short_description = ?
                , description = ?
                , website = ?
                , email = ?
                , phone_number = ?
                , address = ?
                , city = ?
                , postal_code = ?
                , state = ?
                , country = ?
                , date_update = CURRENT_TIMESTAMP
                WHERE id = ?
            `;
            const values = Array();
            values.push(params.name);
            values.push(params.shortDescription);
            values.push(params.description);
            values.push(params.website);
            values.push(params.email);
            values.push(params.phoneNumber);
            values.push(params.address);
            values.push(params.city);
            values.push(params.postalCode);
            values.push(params.state);
            values.push(params.country);
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

                    const query = `DELETE FROM ${this.constructor.TB_NAME} WHERE id = ?`;
                    const stmt = this.db.prepare(query);
                    stmt.run(id);
                    return {
                        success: true,
                    }

                } else {

                    const query = `
                        UPDATE ${this.constructor.TB_NAME}
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


    getAllDeleted() {

        let query = `
            SELECT * FROM ${this.constructor.TB_NAME} 
            WHERE deleted = 1 
            ORDER by date_delete 
        `;

        const stmt = this.db.prepare(query);

        return stmt.all();

    }

    getAllDeletedCount() {

        let query = `
            SELECT count(*) AS total FROM ${this.constructor.TB_NAME} 
            WHERE deleted = 1 
        `;

        const stmt = this.db.prepare(query);
        const result = stmt.get();
        return result.total;        


    }

}


export default SellerDB;