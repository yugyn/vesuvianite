import {app} from 'electron';
import path from 'node:path';
import Database from 'better-sqlite3';

class AppDB {

    constructor() {
        const dbPath = path.join(app.getPath('userData'), 'vesuvianite.sqlite');
console.log(dbPath);        
        this.db = new Database(dbPath);        
        this.db.pragma('journal_mode = WAL');
        this.setUpDatabase();
    }

    setUpDatabase() {
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS task(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            completed INTEGER DEFAULT 0)
        `)
    }

    close() {
        this.db.close();
    }

}


export default AppDB;