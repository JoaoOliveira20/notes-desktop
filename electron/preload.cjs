const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getAppVersion: () => ipcRenderer.invoke("app:get-version"),

  loadNotesData: () => ipcRenderer.invoke("notes-data:load"),

  saveNotesData: (data) => ipcRenderer.invoke("notes-data:save", data),

  exportNotesData: (data) => ipcRenderer.invoke("notes-data:export", data),

  importNotesData: () => ipcRenderer.invoke("notes-data:import"),
});