import { ipcMain } from "electron";
import TaskDatabase from "./taskDatabase";
import MineralClassDB from "./MineralClassDB";
import CrystalSystemDB from "./CrystalSystemDB";
import MineralDB from "./MineralDB";

export default function ipcHandlers(db) {

    const taskDB = new TaskDatabase(db.db);
    const mineralClassDB = new MineralClassDB(db.db);
    const crystalSystemDB = new CrystalSystemDB(db.db);
    const mineralDB = new MineralDB(db.db);

    ipcMain.handle('tasks:add', (_, title) => {
        return taskDB.addTask(title);
    });

    ipcMain.handle('tasks:delete', (_, id) => {
        return taskDB.deleteTask(id);
    });

    ipcMain.handle('tasks:complete', (_, params) => {
        return taskDB.completeTask(params.id, params.completed);
    });

    ipcMain.handle('tasks:getAll', () => {
        return taskDB.getAllTasks();
    });

    ipcMain.handle('mineralClass:getAll', () => {
        return mineralClassDB.getAll();
    });

    ipcMain.handle('crystalSystem:getAll', () => {
        return crystalSystemDB.getAll();
    });
    ipcMain.handle('crystalSystem:get', (_, id) => {
        return crystalSystemDB.get(id);
    });

    ipcMain.handle('mineral:getAll', (_, params) => {
        return mineralDB.getAll(params);
    });
    ipcMain.handle('mineral:get', (_, id) => {
        return mineralDB.get(id);
    });
    ipcMain.handle('mineral:getAllByElement', (_, params) => {
        return mineralDB.getAllByElement(params.elementName, params.elementId, params.filter);
    });
    ipcMain.handle('mineral:getAllCounts', (_, params) => {
        return mineralDB.getAllCounts(params);
    });
    ipcMain.handle('mineral:save', (_, params) => {
        return mineralDB.save(params);
    });
    ipcMain.handle('mineral:delete', (_, id) => {
        return mineralDB.delete(id);
    });

}