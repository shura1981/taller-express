const { ipcRenderer, contextBridge } = require('electron');
const nameExpose = 'apiMainWindow';
const eventos = {
  MESSAGE: 'message-from-renderer',
  MESSAGE_MAIN: 'message-from-main'
}
// Enviar un mensaje al proceso principal
ipcRenderer.send(eventos.MESSAGE, 'se carga el preload');

// Escuchar un mensaje desde el proceso principal
ipcRenderer.on(eventos.MESSAGE_MAIN, (event, arg) => {
  console.log("preload:",arg);  // Imprime "¡Hola desde el proceso principal!"
});


window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})


contextBridge.exposeInMainWorld(nameExpose, {
  sendMessage: (data) => ipcRenderer.send(eventos.MESSAGE, data),
  onMessageMain: (callback) => ipcRenderer.on(eventos.MESSAGE_MAIN, (event, data) => callback(data)),
  theme: (callback) => ipcRenderer.on('theme', callback)
});