const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // You can expose functions here if needed to communicate between frontend and Electron
  isElectron: true
});
