class MineralClassDB {

    constructor(db) {
        this.db = db
    }

    getAll() {

        const stmt = this.db.prepare('SELECT * FROM mineral_class ORDER BY sort');
        return stmt.all();

    }

    static getMineralsCount(element) {
        return 0;
    }

}


export default MineralClassDB;