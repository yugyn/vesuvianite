
class ImageDB {

    static TB_NAME = 'image';

    constructor(db) {
        this.db = db
    }

    get(id) {

        const query = `
            SELECT * FROM image 
            WHERE id = ?
        `;

        const stmt = this.db.prepare(query);
        const element = stmt.get(id);
        return element;

    }

    getAll(params) {

        const filters = Array();
        let query = `
            SELECT * FROM image 
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

        query += ' ORDER BY sort, id';

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
                INSERT INTO image(element_name, element_id, filename, sort) 
                VALUES(?, ?, ?, ?)
            `;
            const values = Array();
            values.push(params.elementName);
            values.push(params.elementId);
            values.push(params.filename);
            values.push(params.sort);

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
                UPDATE image
                set element_name = ?
                , element_id = ?
                , filename = ?
                , date_update = CURRENT_TIMESTAMP
                WHERE id = ?
            `;
            const values = Array();
            values.push(params.elementName);
            values.push(params.elementId);
            values.push(params.filename);
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

                    const query = `DELETE FROM image WHERE id = ?`;
                    const stmt = this.db.prepare(query);
                    stmt.run(id);
                    return {
                        success: true,
                    }

                } else {

                    const query = `
                        UPDATE image
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

    updateOrders(orderedIds) {

        try {

            const query = "UPDATE image SET sort = ? WHERE id = ?";
        
            for(let i = 0; i < orderedIds.length; i++) {

                const id = orderedIds[i];
                const newSortValue = i;
            
                const values = Array();
                values.push(newSortValue);
                values.push(id);

                const stmt = this.db.prepare(query);
                stmt.run(values);    

            }

            return { success: true };

        } catch (error) {
            return {
                error: err.message,
            }
        }

    }

    getLastSort(elementName, elementId) {

        const query = `
            SELECT COALESCE(MAX(sort), -1) as lastSort 
            FROM image 
            WHERE element_name = ? and element_id = ?
        `;

        const stmt = this.db.prepare(query);
        const element = stmt.get(elementName, elementId);
        return element.lastSort;

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


export default ImageDB;