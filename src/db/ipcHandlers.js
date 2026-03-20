import { ipcMain } from "electron";

export default function setUpHandlers(db) {

    ipcMain.handle('tasks:add', (_, title) => {
        return db.addTask(title);
    });

    ipcMain.handle('tasks:delete', (_, id) => {
        return db.deleteTask(id);
    });

    ipcMain.handle('tasks:complete', (_, params) => {
        return db.completeTask(params.id, params.completed);
    });

    ipcMain.handle('tasks:getAll', () => {
        return db.getAllTasks();
    });

}