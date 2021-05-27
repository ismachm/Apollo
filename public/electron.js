const electron = require('electron');
const {BrowserWindow, app, nativeTheme} =  require('electron');
const isDev = require('electron-is-dev');

let mainWindow;
nativeTheme.themeSource = 'dark';

function createWindow() {

    mainWindow = new BrowserWindow({

        width: 1700,
        minWidth: 1325,
        height: 900,
        minHeight: 600,
        title: "APOLLO",
        titleBarStyle: "hiddenInset",
        webPreferences: {
            nodeIntegration: true,
        }
    });

    mainWindow.setMenu(null);
    mainWindow.loadURL('http://localhost:3000/home');


    if (isDev) {
        // Open the DevTools.
        //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
