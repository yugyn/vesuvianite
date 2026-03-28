class CrystalSystemDB {

    constructor(db) {
        this.db = db
    }

    get(id) {

        const stmt = this.db.prepare('SELECT * FROM crystal_system WHERE id = ?');
        const element = stmt.get(id);
        return element;

    }

    getAll() {

        const query = `
            SELECT cs.*,
            COUNT(m.id) AS count_mineral 
            FROM crystal_system AS cs 
            LEFT JOIN mineral as m ON m.crystal_system_id = cs.id
            GROUP BY cs.id
            ORDER BY cs.sort
        `
        const stmt = this.db.prepare(query);
        return stmt.all();

    }

}


export default CrystalSystemDB;