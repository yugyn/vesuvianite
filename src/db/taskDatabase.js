class TaskDatabase {

    constructor(db) {
        this.db = db
    }

    addTask(title) {

    console.log(1);
    console.log(this.db);
        const stmt = this.db.prepare('INSERT INTO task (title) VALUES(?)');
    console.log(2);
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

}


export default TaskDatabase;