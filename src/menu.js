const { app, BrowserWindow, ipcMain, Tray, nativeImage, Menu, dialog } = require('electron');

const setMenu = (mainWindow) => {

    const template = [
        {
            label: 'Theme',
            submenu: [
                {
                    label: 'Light',
                    click() {
                        mainWindow.webContents.send('theme', 'light');
                    },
                    accelerator: 'CmdOrCtrl+L'
                },
                {
                    label: 'Dark',
                    click() {
                        mainWindow.webContents.send('theme', 'dark');
                    },
                    accelerator: 'CmdOrCtrl+D'
                },
                {
                    label: 'System',
                    click() {
                        mainWindow.webContents.send('theme', 'system');
                    },
                    accelerator: 'CmdOrCtrl+S'
                }
            ],
        },
        {
            label: 'Inicio',
            submenu: [
                {
                    label: 'custom handler',
                    click() {
                        console.log('👋');
                        mainWindow.webContents.send('ping', 'pong 👋');
                    }
                },
                {
                    label: 'New Window',
                    click() {
                        ipcMain.emit('newWindow');
                    }
                }
            ]
        }
    ];

    // if you are in Mac, just add the Name of the App
    if (process.platform === 'darwin') {
        template.unshift({
            label: app.getName(),
        });
    };

    // Developer Tools in Development Environment
    if (process.env.NODE_ENV !== 'production') {
        template.push({
            label: 'DevTools',
            submenu: [
                {
                    label: 'Show/Hide Dev Tools',
                    accelerator: process.platform == 'darwin' ? 'Comand+D' : 'Ctrl+D',
                    click(item, focusedWindow) {
                        focusedWindow.toggleDevTools();
                    }
                },
                {
                    role: 'reload'
                }
            ]
        })
    }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

};

module.exports = setMenu;