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

  if (process.env.NODE_ENV === "development") {
    win.loadURL("http://localhost:5173");
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

function getNotesDataFilePath() {
  return path.join(app.getPath("userData"), "notes-data.json");
}

function createEmptyNotesData() {
  return {
    notes: [],
    categories: [],
  };
}

ipcMain.handle("app:get-version", () => {
  return app.getVersion();
});

ipcMain.handle("notes-data:load", async () => {
  const filePath = getNotesDataFilePath();

  try {
    const data = await fs.readFile(filePath, "utf-8");
    const parsedData = JSON.parse(data);

    return {
      notes: Array.isArray(parsedData.notes) ? parsedData.notes : [],
      categories: Array.isArray(parsedData.categories)
        ? parsedData.categories
        : [],
    };
  } catch {
    return createEmptyNotesData();
  }
});

ipcMain.handle("notes-data:save", async (_event, data) => {
  const filePath = getNotesDataFilePath();

  const safeData = {
    notes: Array.isArray(data.notes) ? data.notes : [],
    categories: Array.isArray(data.categories) ? data.categories : [],
  };

  await fs.writeFile(filePath, JSON.stringify(safeData, null, 2), "utf-8");
});

ipcMain.handle("notes-data:export", async (_event, data) => {
  const result = await dialog.showSaveDialog({
    title: "Exportar backup de notas",
    defaultPath: "notes-desktop-backup.json",
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

  const safeData = {
    notes: Array.isArray(data.notes) ? data.notes : [],
    categories: Array.isArray(data.categories) ? data.categories : [],
  };

  await fs.writeFile(
    result.filePath,
    JSON.stringify(safeData, null, 2),
    "utf-8"
  );
});

ipcMain.handle("notes-data:import", async () => {
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
  const parsedData = JSON.parse(data);

  return {
    notes: Array.isArray(parsedData.notes) ? parsedData.notes : [],
    categories: Array.isArray(parsedData.categories)
      ? parsedData.categories
      : [],
  };
});

app.whenReady().then(() => {
  createWindow();
});