import { app, ipcMain, BrowserWindow, Menu } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import AppDB from './db/AppDB';
import ipcHandlers from './db/ipcHandlers';

let db;
let mainWindow;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
//  Menu.setApplicationMenu(null);
  // Create the browser window.
  mainWindow = new BrowserWindow({
    show: false,         // Evita il "lampo" bianco al caricamento      
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.maximize();
  mainWindow.show();

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

  db = new AppDB();
  ipcHandlers(db);

  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  db.close();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.



function createAboutWindow() {

  const aboutWindow = new BrowserWindow({
    height: 400,
    width: 400,
    parent: mainWindow,
    modal: true,         // Rende la finestra bloccante (modale)
    resizable: false,    // Disabilita il ridimensionamento (toglie l'icona resize)
    minimizable: false,  // Opzionale: toglie il tasto per iconizzare
    maximizable: false,  // Toglie il tasto "ingrandisci"
    show: false,         // Evita il "lampo" bianco al caricamento      
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  aboutWindow.setMenu(null);

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    aboutWindow.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/about.html`);
  } else {
    aboutWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/about.html`));
  }

  aboutWindow.once('ready-to-show', () => {
    aboutWindow.show();
  });

}


// Ascolta il messaggio "open-about-window" dal Renderer
ipcMain.on('window:about', () => {
  createAboutWindow();
});




function createWhatisWindow() {

  const whatisWindow = new BrowserWindow({
    height: 400,
    width: 800,
    parent: mainWindow,
    modal: true,         // Rende la finestra bloccante (modale)
    resizable: false,    // Disabilita il ridimensionamento (toglie l'icona resize)
    minimizable: false,  // Opzionale: toglie il tasto per iconizzare
    maximizable: false,  // Toglie il tasto "ingrandisci"
    show: false,         // Evita il "lampo" bianco al caricamento      
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  whatisWindow.setMenu(null);

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    whatisWindow.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/whatis.html`);
  } else {
    whatisWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/whatis.html`));
  }

  whatisWindow.once('ready-to-show', () => {
    whatisWindow.show();
  });

}


// Ascolta il messaggio "open-about-window" dal Renderer
ipcMain.on('window:whatis', () => {
  createWhatisWindow();
});