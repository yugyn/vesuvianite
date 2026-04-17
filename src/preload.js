import { contextBridge, ipcRenderer, webUtils} from 'electron';

const api = {

    // File system
    getFilePath: (file) => webUtils.getPathForFile(file),
    getPathMedia: (fileName) => ipcRenderer.invoke('path:media', fileName),
    uploadMedias: (params) => ipcRenderer.invoke('media:upload-multiple', params),
    saveMedias: (params) => ipcRenderer.invoke('media:save-multiple', params),
    deleteFile: (params) => ipcRenderer.invoke('file:delete', params),
    deleteFolder: (params) => ipcRenderer.invoke('folder:delete', params),
    openFile: (fullPath) => ipcRenderer.invoke('file:open', fullPath),
    downloadFile: (params) => ipcRenderer.invoke('file:download', params),

    // Link
    openLink: (url) => ipcRenderer.send('link:open', url),

    // Trash
    getAllTrashes: (element) => ipcRenderer.invoke('trash:getAll', element),
    getAllTrashesCount: () => ipcRenderer.invoke('trash:getAllCounts'),

    // Media
    getMedia: (id) => ipcRenderer.invoke('media:get', id),
    getAllMedias: (params) => ipcRenderer.invoke('media:getAll', params),
    restoreMedia: (id) => ipcRenderer.invoke('media:restore', id),
    deleteMedia: (params) => ipcRenderer.invoke('media:delete', params),
    deleteAllMedias: (params) => ipcRenderer.invoke('media:deleteAll', params),
    updateMediaOrder: (orderedIds) => ipcRenderer.invoke('media:update-orders', orderedIds),

    // Annotation
    getAnnotation: (id) => ipcRenderer.invoke('annotation:get', id),
    getAllAnnotations: (params) => ipcRenderer.invoke('annotation:getAll', params),
    getAllAnnotationsByElement: (params) => ipcRenderer.invoke('annotation:getAllByElement', params),
    saveAnnotation: (params) => ipcRenderer.invoke('annotation:save', params),
    deleteAnnotation: (params) => ipcRenderer.invoke('annotation:delete', params),
    deleteAllAnnotations: (params) => ipcRenderer.invoke('annotation:deleteAll', params),

    /*
    **********************************************************************
    */

    // Seller
    getSeller: (id) => ipcRenderer.invoke('seller:get', id),
    getAllSellers: (params) => ipcRenderer.invoke('seller:getAll', params),
    saveSeller: (params) => ipcRenderer.invoke('seller:save', params),
    deleteSeller: (id) => ipcRenderer.invoke('seller:delete', id),
    restoreSeller: (id) => ipcRenderer.invoke('seller:restore', id),








    openAbout: () => ipcRenderer.send('window:about'),
    openWhatis: () => ipcRenderer.send('window:whatis'),



    addTask: (title) => ipcRenderer.invoke('tasks:add', title),
    deleteTask: (id) => ipcRenderer.invoke('tasks:delete', id),
    completeTask: (params) => ipcRenderer.invoke('tasks:complete', params),
    getAllTasks: () => ipcRenderer.invoke('tasks:getAll'),

    getAllMineralClasses: () => ipcRenderer.invoke('mineralClass:getAll'),

    getAllCrystalSystems: () => ipcRenderer.invoke('crystalSystem:getAll'),
    getCrystalSystem: (id) => ipcRenderer.invoke('crystalSystem:get', id),

    getMineral: (id) => ipcRenderer.invoke('mineral:get', id),
    getAllMinerals: (params) => ipcRenderer.invoke('mineral:getAll', params),
    getAllMineralsCount: (params) => ipcRenderer.invoke('mineral:getAllCounts', params),
    getAllMineralsByElement: (params) => ipcRenderer.invoke('mineral:getAllByElement', params),
    saveMineral: (params) => ipcRenderer.invoke('mineral:save', params),
    deleteMineral: (id) => ipcRenderer.invoke('mineral:delete', id),


    getContainer: (id) => ipcRenderer.invoke('container:get', id),
    getAllContainers: (params) => ipcRenderer.invoke('container:getAll', params),
    getAllContainersCount: (params) => ipcRenderer.invoke('container:getAllCounts', params),
    getAllContainersByElement: (params) => ipcRenderer.invoke('container:getAllByElement', params),
    saveContainer: (params) => ipcRenderer.invoke('container:save', params),
    deleteContainer: (id) => ipcRenderer.invoke('container:delete', id),



}

contextBridge.exposeInMainWorld('electronAPI', api);