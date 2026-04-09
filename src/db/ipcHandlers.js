import { ipcMain } from "electron";
import TaskDatabase from "./taskDatabase";
import MineralClassDB from "./MineralClassDB";
import CrystalSystemDB from "./CrystalSystemDB";
import MineralDB from "./MineralDB";
import ContainerDB from "./ContainerDB";
import SellerDB from "./SellerDB";
import ImageDB from "./ImageDB";
import AnnotationDB from "./AnnotationDB";

export default function ipcHandlers(db) {

    const taskDB = new TaskDatabase(db.db);
    const mineralClassDB = new MineralClassDB(db.db);
    const crystalSystemDB = new CrystalSystemDB(db.db);
    const mineralDB = new MineralDB(db.db);
    const sellerDB = new SellerDB(db.db);
    const containerDB = new ContainerDB(db.db);
    const imageDB = new ImageDB(db.db);
    const annotationDB = new AnnotationDB(db.db);

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
    ipcMain.handle('seller:save', (_, params) => {
        return sellerDB.save(params);
    });
    ipcMain.handle('seller:delete', (_, id) => {
        return sellerDB.delete(id);
    });


    ipcMain.handle('seller:getAll', (_, params) => {
        return sellerDB.getAll(params);
    });
    ipcMain.handle('seller:get', (_, id) => {
        return sellerDB.get(id);
    });

    ipcMain.handle('container:getAll', (_, params) => {
        return containerDB.getAll(params);
    });
    ipcMain.handle('container:get', (_, id) => {
        return containerDB.get(id);
    });
    ipcMain.handle('container:getAllByElement', (_, params) => {
        return containerDB.getAllByElement(params.elementName, params.elementId, params.filter);
    });
    ipcMain.handle('container:getAllCounts', (_, params) => {
        return containerDB.getAllCounts(params);
    });
    ipcMain.handle('container:save', (_, params) => {
        return containerDB.save(params);
    });
    ipcMain.handle('container:delete', (_, id) => {
        return containerDB.delete(id);
    });


    ipcMain.handle('image:getAll', (_, params) => {
        return imageDB.getAll(params);
    });
    ipcMain.handle('image:update-orders', (_, orderedIds) => {
        return imageDB.updateOrders(orderedIds);
    });

    ipcMain.handle('annotation:getAll', (_, params) => {
        return annotationDB.getAll(params);
    });
    ipcMain.handle('annotation:get', (_, id) => {
        return annotationDB.get(id);
    });
    ipcMain.handle('annotation:getAllByElement', (_, params) => {
        return annotationDB.getAllByElement(_, params);
    });
    ipcMain.handle('annotation:save', (_, params) => {
        return annotationDB.save(params);
    });
    ipcMain.handle('annotation:delete', (_, id) => {
        return annotationDB.delete(id);
    });


}