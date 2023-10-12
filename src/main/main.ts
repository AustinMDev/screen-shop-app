/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import fs from 'fs';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { Mutex } from 'async-mutex';
import _ from 'lodash';

const mutex = new Mutex();

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}


app.on('ready', () => {
  autoUpdater.setFeedURL({
    provider: 'github',
    repo: 'screen-shop-app',
    owner: 'AustinMDev'
  });

  autoUpdater.checkForUpdatesAndNotify();
});

autoUpdater.on('update-available', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Update Available',
    message: 'A new version is available. Do you want to update now?',
    buttons: ['Yes', 'No']
  });
  // Handle user response
});


let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

const updateConfig = async (updateFn) => {
  const release = await mutex.acquire();
  try {
    const filePath = path.join(__dirname, '../../config/config.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    let json = JSON.parse(data);

    const retainSections = {
      elementSKUs: json.elementSKUs,
      sizeLabels: json.sizeLabels,
    };
    // Update JSON data using the update function passed as an argument
    const updatedJson = updateFn(json);

    delete updatedJson.elementSKUs;
    delete updatedJson.sizeLabels;

    // Merge with existing data to prevent overwriting
    json = {...retainSections, sizePrices: updatedJson.sizePrices, additionalPrices: updatedJson };

    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
  } catch (error) {
    console.error('Error during config update:', error);
  } finally {
    release();
  }
};



ipcMain.on('save-changes', async (event, data) => {
  await updateConfig(() => {
    return { ...data };
  });
  event.reply('save-changes-reply', 'Data saved successfully');
});


// For other updates, for example, to update 'screenPricing':
const updateScreenPricing = async () => {
  await updateConfig((json) => {
    json['screenPricing'].push({
      label: 'New Label',
      sku: 'New SKU',
      price: 'New Price',
      description: 'New Description',
    });
    return json;
  });
};


if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {

  app.setName('City Mill Screen Shop');

  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1280,
    height: 1024,
    title: 'City Mill Screen Shop',
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
        scrollBounce: true
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
