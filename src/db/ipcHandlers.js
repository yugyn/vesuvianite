import { ipcMain } from "electron";

import TrashDB from "./TrashDB";
import MineralClassDB from "./MineralClassDB";
import CrystalSystemDB from "./CrystalSystemDB";
import MineralDB from "./MineralDB";
import ContainerDB from "./ContainerDB";
import SellerDB from "./SellerDB";
import ImageDB from "./ImageDB";
import AnnotationDB from "./AnnotationDB";

export default function ipcHandlers(db) {

    const mineralClassDB = new MineralClassDB(db.db);
    const crystalSystemDB = new CrystalSystemDB(db.db);
    const mineralDB = new MineralDB(db.db);
    const containerDB = new ContainerDB(db.db);

    // Trash
    const trashDB = new TrashDB(db.db);

    ipcMain.handle('trash:getAll', (_, element) => {
        return trashDB.getAll(element);
    });
    ipcMain.handle('trash:getAllCounts', () => {
        return trashDB.getAllCounts();
    });



    // Image
    const imageDB = new ImageDB(db.db);

    ipcMain.handle('image:get', (_, id) => {
        return imageDB.get(id);
    });
    ipcMain.handle('image:getAll', (_, params) => {
        return imageDB.getAll(params);
    });
    ipcMain.handle('image:delete', (_, params) => {
        return imageDB.delete(params);
    });
    ipcMain.handle('image:deleteAll', (_, params) => {
        return imageDB.deleteAll(params);
    });
    ipcMain.handle('image:restore', (_, id) => {
        return imageDB.restore(id);
    });
    ipcMain.handle('image:update-orders', (_, orderedIds) => {
        return imageDB.updateOrders(orderedIds);
    });



    // Annotation
    const annotationDB = new AnnotationDB(db.db);

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
    ipcMain.handle('annotation:delete', (_, params) => {
        return annotationDB.delete(params);
    });
    ipcMain.handle('annotation:deleteAll', (_, params) => {
        return annotationDB.deleteAll(params);
    });



    // Seller
    const sellerDB = new SellerDB(db.db);

    ipcMain.handle('seller:getAll', (_, params) => {
        return sellerDB.getAll(params);
    });
    ipcMain.handle('seller:get', (_, id) => {
        return sellerDB.get(id);
    });
    ipcMain.handle('seller:save', (_, params) => {
        return sellerDB.save(params);
    });
    ipcMain.handle('seller:delete', (_, id) => {
        return sellerDB.delete(id);
    });
   ipcMain.handle('seller:restore', (_, id) => {
        return sellerDB.restore(id);
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






}