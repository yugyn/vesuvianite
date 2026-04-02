import { ELEMENT_CRYSTALSYSTEM, MINERAL_TYPOLOGY_REAL, MINERAL_TYPOLOGY_VIRTUAL, MINERAL_FILTER_ALL, MINERAL_FILTER_REAL, MINERAL_FILTER_VIRTUAL } from '../costants';

class MineralDB {

    constructor(db) {
        this.db = db
    }

    get(id) {

        const query = `
            SELECT m.*, cs.id as csId, cs.name as csName, mc.id as mcId, mc.name as mcName FROM mineral AS m 
            LEFT JOIN crystal_system AS cs ON m.crystal_system_id = cs.id 
            LEFT JOIN mineral_class AS mc ON m.mineral_class_id = mc.id 
            WHERE m.id = ?
        `;

        const stmt = this.db.prepare(query);
        const element = stmt.get(id);
        return element;

    }

    getAll(params) {

        const filters = Array();
        let query = `
            SELECT m.*, cs.id as csId, cs.name as csName, mc.id as mcId, mc.name as mcName FROM mineral AS m 
            LEFT JOIN crystal_system AS cs ON m.crystal_system_id = cs.id 
            LEFT JOIN mineral_class AS mc ON m.mineral_class_id = mc.id 
            WHERE true 
        `;

        if(params.deleted !== null && params.deleted !== '') {
            query += ' AND m.deleted = 0';
        } else {
            query += ' AND m.deleted = 1';
        }

        if(params.content !== null && params.content !== undefined && params.content !== '') {
            query += ' AND m.name like ?';
            filters.push(`%${params.content}%`);
        }
        if(params.typology && params.typology !== '') {
            query += ' AND m.typology = ?';
            filters.push(params.typology);
        }
        if(params.genesis && params.genesis !== '') {
            query += ' AND m.genesis = ?';
            filters.push(params.genesis);
        }
        if(params.crystalSystem && params.crystalSystem !== '') {
            query += ' AND m.crystal_system_id = ?';
            filters.push(params.crystalSystem);
        }
        if(params.mineralClass && params.mineralClass !== '') {
            query += ' AND m.mineral_class_id = ?';
            filters.push(params.mineralClass);
        }

        if(params.elementName && params.elementId) {
            if(params.elementName == ELEMENT_CRYSTALSYSTEM) {
                query += ' AND m.crystal_system_id = ?'
                filters.push(params.elementId);
            }
        }

        query += ' ORDER BY m.name';

        const stmt = this.db.prepare(query);

        return stmt.all(filters);

    }

    getCountByFilter(params, filter) {

        const filters = Array();
        let query = `
            SELECT count(*) AS total FROM mineral
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
        if(params.typology && params.typology !== '') {
            query += ' AND typology = ?';
            filters.push(params.typology);
        }
        if(params.genesis && params.genesis !== '') {
            query += ' AND genesis = ?';
            filters.push(params.genesis);
        }
        if(params.crystalSystem && params.crystalSystem !== '') {
            query += ' AND crystal_system_id = ?';
            filters.push(params.crystalSystem);
        }
        if(params.mineralClass && params.mineralClass !== '') {
            query += ' AND mineral_class_id = ?';
            filters.push(params.mineralClass);
        }

        if(params.elementName && params.elementId) {
            if(params.elementName == ELEMENT_CRYSTALSYSTEM) {
                query += ' AND crystal_system_id = ?'
                filters.push(params.elementId);
            }
        }

        if(filter) {

            if(filter == MINERAL_FILTER_REAL) {
                query += ' AND typology = ?';
                filters.push(MINERAL_TYPOLOGY_REAL);
            } else if(filter == MINERAL_FILTER_VIRTUAL) {
                query += ' AND typology = ?';
                filters.push(MINERAL_TYPOLOGY_VIRTUAL);
            }

        }

        const stmt = this.db.prepare(query);
        const result = stmt.get(filters);
        return result.total;        

    }

    getAllCounts(params) {

        return {
            total: this.getCountByFilter(params)
            , real: this.getCountByFilter(params, MINERAL_FILTER_REAL)
            , virtual: this.getCountByFilter(params, MINERAL_FILTER_VIRTUAL)
            , normal: 100
            , fumarolic: 101
            , both: 102
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
                INSERT INTO mineral(name, typology, genesis, formula, crystal_system_id, mineral_class_id, key) 
                VALUES(?, ?, ?, ?, ?, ?, ?)
            `;
            const values = Array();
            values.push(params.name);
            values.push(params.typology);
            values.push(params.genesis);
            values.push(params.formula);
            values.push(params.crystalSystem);
            values.push(params.mineralClass);

            const key = params.name + '-' + params.typology;
            values.push(key);

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
                UPDATE mineral
                set name = ?
                , typology = ?
                , genesis = ?
                , formula = ?
                , crystal_system_id = ?
                , mineral_class_id = ?
                , key = ? 
                , date_update = CURRENT_TIMESTAMP
                WHERE id = ?
            `;
            const values = Array();
            values.push(params.name);
            values.push(params.typology);
            values.push(params.genesis);
            values.push(params.formula);
            values.push(params.crystalSystem);
            values.push(params.mineralClass);

            const key = params.name + '-' + params.typology;
            values.push(key);
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

                    const query = `DELETE FROM mineral WHERE id = ?`;
                    const stmt = this.db.prepare(query);
                    stmt.run(id);
                    return {
                        success: true,
                    }

                } else {

                    const query = `
                        UPDATE mineral
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


export default MineralDB;