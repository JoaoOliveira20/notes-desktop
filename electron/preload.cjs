const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getAppVersion: () => ipcRenderer.invoke("app:get-version"),
  
  loadNotes: () => ipcRenderer.invoke("notes:load"),

  saveNotes: (notes) => ipcRenderer.invoke("notes:save", notes),
});