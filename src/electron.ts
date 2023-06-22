import { app, BrowserWindow, ipcMain } from 'electron';
import { findLeagueOfLegends, LeagueOfLegendsData } from "./lib/leagueOflegends";
import { ApiService } from "./lib/apiCalls";
import { join } from 'path';
let mainWindow: any;

app.on('ready', createWindow);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true
    },
  });
  const startFile = join(__dirname, '..', 'build', 'index.html');
  // set this to 'production' for builds
  // const isDev = process.env.NODE_ENV === 'production';
  const isDev=false;
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(startFile);
  }
  
    mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.handle('get-data', async () => {
  try {
    const data: LeagueOfLegendsData | null = await findLeagueOfLegends();
    if (data) {
      const apiService = new ApiService(data);

      // Make GET request
      const getMeResponse = await apiService.getMe();
      if (getMeResponse) {
        return getMeResponse;
      }
    } else {
      throw new Error('League of Legends client not found.');
    }
  } catch (error: any) {
    throw new Error(`An error occurred: ${error.message}`);
  }
});
