import {app} from 'electron';
import path from 'node:path';
import Database from 'better-sqlite3';

class AppDatabase {

    constructor() {
        const dbPath = path.join(app.getPath('userData'), 'to-do.sqlite');
        this.db = new Database(dbPath);        
        this.db.pragma('journal_mode = WAL');
        this.setUpDatabase();
    }

    setUpDatabase() {
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS task(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            completed INTEGER DEFAULT 0            )
        `)
    }

    addTask(title) {

        const stmt = this.db.prepare('INSERT INTO task (title) VALUES(?)');
        const info = stmt.run(title);
        return {
            id: info.lastInsertRowid,
            title: title,
            completed: 0,
        }

    }

    deleteTask(id) {

        const stmt = this.db.prepare('DELETE FROM task where id = ?');
        const info = stmt.run(id);
        return info.changes > 0;

    }

    completeTask(id, completed) {

        const stmt = this.db.prepare('UPDATE task set completed = ? where id = ?');
        const info = stmt.run(completed, id);
        return info.changes > 0;

    }

    getAllTasks() {

        const stmt = this.db.prepare('SELECT * FROM task ORDER BY id DESC');
        return stmt.all();

    }

    close() {
        this.db.close();
    }

}


export default AppDatabase;