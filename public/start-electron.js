// we had to place this file in `public` for the bundler
/* eslint-disable import/no-extraneous-dependencies */
const { app, BrowserWindow, globalShortcut, dialog, ipcMain, Menu, shell } = require('electron');
/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const path = require('path');
const isDev = require('electron-is-dev');

// const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
// const videoExtensions = ['mkv', 'avi', 'mp4'];

/**
 * Utility function to convert the ~ to an absolute path if necessary
 * @param {*} filepath
 */
const resolveHome = filepath => {
	if (filepath[0] === '~') {
		return path.join(process.env.HOME, filepath.slice(1));
	}
	return filepath;
};

/**
 * Function called when the user press cmd+O or click on the open button, or just when the app opens for the first time.
 * @param {*} event The event name, useless, but it will be here.
 * @param {*} defaultFolder The user default folder as setup in the user prefs (optional, will only be present when the opens for the first time).
 */
const openFileOrFolder = (event, defaultFolder) => {
	const uris =
		// if provided opening the folder passed as a parameter
		(defaultFolder !== undefined && defaultFolder !== '' && [defaultFolder]) ||
		// otherwise opening the file dialog
		dialog.showOpenDialog({
			properties: ['openFile', 'openDirectory'],
			filters: [
				{
					name: 'Images',
					extensions: imageExtensions
				}
				// { name: 'Movies', extensions: videoExtensions }
			]
		});

	// if the user cancels, uri will be undefined
	if (uris) {
		let uri = uris[0];
		uri = resolveHome(uri);

		// preparing our JSON object
		/*
			{
				folder: '/Users/Max',
				currentFileIndex: 0,
				filesInFolder: ['dog.jpeg', 'cat.png']
			}
		*/
		// the folder of the file selected by the user
		// if the user selected a folder it will just return the same value
		const stats = fs.lstatSync(uri);
		const folder = stats.isFile() ? path.dirname(uri) : uri;

		// defaulting to first picture of the folder
		const payload = {
			currentFileIndex: 0,
			folder,
			filesInFolder: fs.readdirSync(folder).filter(image => {
				const imageExtension = path.extname(image).replace('.', '');
				return imageExtensions.indexOf(imageExtension) !== -1;
			})
		};

		// if the user selected a file instead of a folder, we update the index
		if (stats.isFile()) {
			payload.currentFileIndex = payload.filesInFolder.indexOf(path.basename(uri));
		}

		// sending to renderer process
		win.webContents.send('fileSelectedByUser', payload);
	}
};

function registerShortcuts() {
	// Register a 'CommandOrControl+O' shortcut listener to open a file or folder.
	globalShortcut.register('CommandOrControl+O', openFileOrFolder);

	// Register shortcut listeners for left and right arrow
	globalShortcut.register('Left', () => {
		// sending to renderer process
		win.webContents.send('leftKeyPressed');
	});
	globalShortcut.register('Right', () => {
		// sending to renderer process
		win.webContents.send('rightKeyPressed');
	});
}

function unregisterShortcuts() {
	globalShortcut.unregister('CommandOrControl+O');
	globalShortcut.unregister('Left');
	globalShortcut.unregister('Right');
}

function createMenu() {
	const template = [
		{
			label: 'Viz',
			submenu: [
				{
					label: 'About',
					click() {
						dialog.showMessageBox({
							message: 'Developed with <3 By Fabien & Max'
						});
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Quit',
					accelerator: 'CmdOrCtrl+Q',
					click() {
						app.quit();
					}
				}
			]
		},
		{
			label: 'File',
			submenu: [
				{
					label: 'Open File or Folder',
					accelerator: 'CmdOrCtrl+O',
					click() {
						openFileOrFolder();
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Rotate left',
					accelerator: 'alt+l',
					click() {
						// TODO implement
						dialog.showMessageBox({
							message: 'rotate left'
						});
					}
				},
				{
					label: 'Rotate right',
					accelerator: 'alt+r',
					click() {
						// TODO implement
						dialog.showMessageBox({
							message: 'rotate right'
						});
					}
				},
				{
					type: 'separator'
				},
				{
					label: 'Delete',
					accelerator: 'CmdOrCtrl+Delete',
					click() {
						// TODO implement
						dialog.showMessageBox({
							message: 'delete'
						});
					}
				}
			]
		},
		{
			role: 'help',
			submenu: [
				{
					label: 'Learn More',
					click() {
						shell.openExternal('http://viz.io');
					}
				}
			]
		}
	];

	const menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);
}

function createWindow() {
	// Create the browser window.
	win = new BrowserWindow({
		width: 1000,
		height: 768,
		webPreferences: {
			webSecurity: false
		}
	});

	// and load the index.html of the app.
	// win.loadURL('http://localhost:3000');
	win.loadURL(
		isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`
	);

	// Open the DevTools.
	// win.webContents.openDevTools();

	// Emitted when the window is closed.
	win.on('closed', () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		win = null;
	});

	// registering / unregistering shortcuts when necessary
	registerShortcuts();
	win.on('focus', registerShortcuts);
	win.on('blur', unregisterShortcuts);

	// setting up the app menus
	createMenu();

	// the "open file or folder" dialog can also be triggered from the React app
	ipcMain.on('openFileOrFolder', openFileOrFolder);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('open-file', openFileOrFolder);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (win === null) {
		createWindow();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
