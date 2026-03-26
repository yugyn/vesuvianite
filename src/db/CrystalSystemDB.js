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

        const stmt = this.db.prepare('SELECT * FROM crystal_system ORDER BY sort');
        return stmt.all();

    }

}


export default CrystalSystemDB;