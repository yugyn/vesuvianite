import { contextBridge, ipcRenderer } from 'electron';

const api = {

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