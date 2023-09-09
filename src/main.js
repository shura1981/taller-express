const { app, BrowserWindow, ipcMain, dialog, Tray, Menu, Notification, nativeImage } = require('electron');
const path = require('path');
const icon = require('./trayIcon');
const setMenu = require('./menu');
const { startServer, port } = require('./server');
const { showNotification } = require('./notification');

// Iniciar el servidor
startServer();

// Configuración de Electron
let mainWindow, secondWin;

function createTray(win) {
    const iconImg = nativeImage.createFromPath(path.join(__dirname, 'public', 'assets','images','notifications.png'))
    const tray = new Tray(iconImg.resize({ width: 16, height: 16 }))
    tray.on('double-click', () => {
        win.isVisible() ? win.hide() : win.show();
    });

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Preferencias del sistema', type: 'radio',
            click() {
            }
        },
        {
            label: 'Item2',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
            ]

        },
        {
            label: 'Item3', type: 'radio',
            click() {
                if (Notification.isSupported()) {
                    const notification = new Notification({
                        title: 'Hello World!',
                        icon: icon,
                        subtitle: 'Nice to see you',
                        body: 'Are you having a good day?',
                        hasReply: true
                    })

                    notification.on('show', () => console.log('Notification shown'))
                    notification.on('click', () => console.log('Notification clicked'))
                    notification.on('close', () => console.log('Notification closed'))
                    notification.on('reply', (event, reply) => {
                        console.log(`Reply: ${reply}`)
                    })

                    notification.show()
                } else {
                    console.log('Hm, are notifications supported on this system?')
                }

            }
        },
        {
            label: 'Item4', type: 'radio',
            async click() {
                const { response } = await dialog.showMessageBox(win, {
                    type: 'question',
                    title: '  Confirm  ',
                    message: 'Are you sure that you want to close this window?',
                    buttons: ['Yes', 'No'],
                })
                if (response === 0) {
                    win.destroy();
                    app.quit();
                }

                // console.log(dialog.showErrorBox("Nutramerican App", "Ocurrió un error"));
            }

        }
    ])
    tray.setToolTip('This is my application.')
    tray.setContextMenu(contextMenu)

//set size tray


}


function createMainWindow() {
    mainWindow = new BrowserWindow({
        show: false, // Para que no se muestre la ventana hasta que esté lista
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });
    mainWindow.loadURL(`http://localhost:${port}`);
    setMenu(mainWindow);
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });
    // Preguntar si se desea cerrar la ventana
    mainWindow.on('close', (e) => {
        e.preventDefault();  // Previene el cierre

        const choice = dialog.showMessageBoxSync(mainWindow, {
            type: 'question',
            buttons: ['Sí', 'No'],
            title: 'Confirmar',
            message: '¿Estás seguro de que quieres salir?'
        });

        // Si el usuario responde "Sí", cierra la ventana
        if (choice === 0) {
            mainWindow.removeAllListeners('close');
            mainWindow.close();
        }
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    createTray(mainWindow);
}

function createNewWindow() {
    secondWin = new BrowserWindow({
        width: 400,
        height: 330,
        title: 'Nueva Entrada',
        modal: true,
        parent: mainWindow,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
        show: false
    });
    secondWin.setMenu(null);
    secondWin.once('ready-to-show', () => {
        secondWin.show()
    })

    secondWin.loadFile(path.join(__dirname, 'public', 'assets', 'modal.html'), { query: { id: 113434 } });

    // secondWin.webContents.openDevTools();

    secondWin.on('closed', () => {
        secondWin = null;
    });
}


// Reload in Development for Browser Windows only dev
// if (process.env.NODE_ENV !== 'production') {
//     require('electron-reload')(__dirname, {
//         electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
//     });
// }


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

// Crear la ventana principal cuando Electron haya terminado de inicializarse
app.whenReady().then(createMainWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Crear la ventana principal cuando se haga clic en el icono del dock y no haya otras ventanas abiertas
app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});



// Events from Renderer
ipcMain.on('message-from-renderer', (event, arg) => {
    console.log("servidor", arg);  // Imprime "¡Hola desde el renderizador!"
    event.reply('message-from-main', arg);
});
ipcMain.on('newWindow', (e, data) => {
    createNewWindow();
});

ipcMain.on('product:new', (e, data) => {
    // send to the Main Window
    const { title, subtitle, body } = data;
    console.log(data);
    const ruta = path.join(__dirname, "public", "assets", "images", "notifications.png");
    const icon = nativeImage.createFromPath(ruta)
    showNotification({
        title: title,
        icon: icon,
        subtitle: subtitle,
        body: body,
    }, () => { console.log("show"); }, () => { console.log("click"); }, () => { console.log("close"); });
    //cerrar secondWin
    secondWin.close();

});