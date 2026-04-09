import { app, ipcMain, BrowserWindow, dialog, protocol, shell } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import AppDB from './db/AppDB';
import ipcHandlers from './db/ipcHandlers';
import ImageDB from './db/ImageDB';

const PATH_IMAGE = path.join(app.getPath('userData'), 'image/');  

ipcMain.handle('path:image', (event, fileName) => {

      let filePath = path.join(PATH_IMAGE, fileName);

  		if (process.platform === 'win32') {

        filePath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
        if (/^[a-zA-Z]\//.test(filePath)) {
          filePath = filePath[0] + ':' + filePath.substring(1);
        }
      }

      return filePath;
});

// Gestisci l'apertura del file
ipcMain.handle('file:open', async (event, fullPath) => {
    await shell.openPath(fullPath);
});

const fs = require('fs');

let db;
let mainWindow;

protocol.registerSchemesAsPrivileged([
  { scheme: 'safe-protocol', privileges: { standard: true, secure: true, supportFetchAPI: true } }
]);


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
	app.quit();
}

const createWindow = () => {
  mainWindow = new BrowserWindow({
    show: false,         // Evita il "lampo" bianco al caricamento      
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, // Fondamentale
        nodeIntegration: false, // Per sicurezza meglio false
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

	protocol.registerFileProtocol('safe-protocol', (request, callback) => {

    	let fileName = request.url.replace('safe-protocol://', '');
      fileName = decodeURIComponent(fileName);
      fileName = fileName.replace(/\/$/, "").replace(/^\//, "");
      let filePath = path.join(PATH_IMAGE, fileName);

  		if (process.platform === 'win32') {

			filePath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
			if (/^[a-zA-Z]\//.test(filePath)) {
				filePath = filePath[0] + ':' + filePath.substring(1);
			}
		}

	    const finalPath = path.normalize(filePath);

	    callback({ path: finalPath });

	});
  
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




ipcMain.handle('image:upload-multiple', async (event, params) => {

	const { canceled, filePaths } = await dialog.showOpenDialog({
    	properties: ['openFile', 'multiSelections'],
    	filters: [{ name: 'Immagini', extensions: ['jpg', 'png', 'gif'] }]
  	});

  	if (canceled) return;

    return filePaths;

});

ipcMain.handle('image:save-multiple', async (event, params) => {

    const results = [];
    const destPath = PATH_IMAGE + params.elementName;  

  	fs.mkdirSync(destPath, { recursive: true });

  	const imageDB = new ImageDB(db.db);
    let sort = imageDB.getLastSort(params.elementName, params.elementId);

    for (const sourcePath of params.pathsSorgente) {

        sort++;

        try {

          const fileName = params.elementId + '_' + Date.now() + path.extname(sourcePath);
          const destPathFile = destPath + '/' + fileName;

          fs.copyFileSync(sourcePath, destPathFile);

  	      const paramsDB = {elementName: params.elementName, elementId: params.elementId, filename: fileName, sort: sort};
    	    imageDB.save(paramsDB);

        } catch (err) {
            console.error(`Errore caricamento file:`, err);
        }

    }
    return results;

});


ipcMain.handle('image:delete', async (event, { id, pathFile, deleted }) => {
    
	try {

	  	const imageDB = new ImageDB(db.db);
        await imageDB.delete(id);

		if(deleted) {

			if (fs.existsSync(pathFile)) {
				fs.unlinkSync(pathFile);
			} else {
				console.warn("File non trovato sul disco, ma rimosso dal DB:", pathFile);
				return { success: true, message: "File fisico non trovato" };
			}

		}

		return { success: true };

    } catch (error) {
        console.error("Errore durante l'eliminazione:", error);
        return { success: false, error: error.message };
    }

});



ipcMain.handle('file:download', async (event, { sourcePath, fileName }) => {

    // 1. Apri la finestra di dialogo del sistema
    const { filePath } = await dialog.showSaveDialog({
        title: 'Salva immagine',
        defaultPath: fileName,
        buttonLabel: 'Salva',
        filters: [{ name: 'Immagini', extensions: ['jpg', 'png', 'gif', 'jpeg'] }]
    });

    // 2. Se l'utente non annulla, copia il file
    if (filePath) {
        try {
            fs.copyFileSync(sourcePath, filePath);
            return { success: true, path: filePath };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }
    return { success: false, canceled: true };
    
});



ipcMain.on('link:open', (event, url) => {
    shell.openExternal(url);
});