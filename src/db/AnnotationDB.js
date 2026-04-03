
class AnnotationDB {

    static TB_NAME = 'annotation';

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

        if(params.elementName !== null && params.elementName !== '') {
            query += ' AND element_name = ?';
            filters.push(params.elementName);
        }

        if(params.elementId !== null && params.elementId !== '') {
            query += ' AND element_id = ?';
            filters.push(params.elementId);
        }

        query += ' ORDER BY priority desc, date desc, id';

        const stmt = this.db.prepare(query);

        return stmt.all(filters);

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
                INSERT INTO ${this.constructor.TB_NAME}(element_name, element_id, content, priority) 
                VALUES(?, ?, ?, ?)
            `;
            const values = Array();
            values.push(params.elementName);
            values.push(params.elementId);
            values.push(params.content);
            values.push(params.priority);

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
                set element_name = ?
                , element_id = ?
                , content = ?
                , priority = ?
                , date_update = CURRENT_TIMESTAMP
                , date = CURRENT_TIMESTAMP
                WHERE id = ?
            `;
            const values = Array();
            values.push(params.elementName);
            values.push(params.elementId);
            values.push(params.content);
            values.push(params.priority);
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
        console.log("qui...");

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

}


export default AnnotationDB;