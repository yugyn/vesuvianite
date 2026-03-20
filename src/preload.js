import { contextBridge, ipcRenderer } from 'electron';

const api = {
    addTask: (title) => ipcRenderer.invoke('tasks:add', title),
    deleteTask: (id) => ipcRenderer.invoke('tasks:delete', id),
    completeTask: (params) => ipcRenderer.invoke('tasks:complete', params),
    getAllTasks: () => ipcRenderer.invoke('tasks:getAll'),
}

contextBridge.exposeInMainWorld('electronAPI', api);