const fs = require("fs/promises");
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "Notes Desktop",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  win.loadURL("http://localhost:5173");
}

ipcMain.handle("app:get-version", () => {
  return app.getVersion();
});

ipcMain.handle("notes:load", async () => {
  const filePath = path.join(app.getPath("userData"), "notes.json");

  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
});

ipcMain.handle("notes:save", async (_event, notes) => {
  const filePath = path.join(app.getPath("userData"), "notes.json");

  await fs.writeFile(filePath, JSON.stringify(notes, null, 2), "utf-8");
});

ipcMain.handle("notes:export", async (_event, notes) => {
  const result = await dialog.showSaveDialog({
    title: "Exportar backup de notas",
    defaultPath: "notes-backup.json",
    filters: [
      {
        name: "JSON",
        extensions: ["json"],
      },
    ],
  });

  if (result.canceled || !result.filePath) {
    return;
  }

  await fs.writeFile(result.filePath, JSON.stringify(notes, null, 2), "utf-8");
});

ipcMain.handle("notes:import", async () => {
  const result = await dialog.showOpenDialog({
    title: "Importar backup de notas",
    filters: [
      {
        name: "JSON",
        extensions: ["json"],
      },
    ],
    properties: ["openFile"],
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  const filePath = result.filePaths[0];
  const data = await fs.readFile(filePath, "utf-8");

  return JSON.parse(data);
});

app.whenReady().then(() => {
  createWindow();
});
