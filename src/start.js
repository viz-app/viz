const { app, BrowserWindow, globalShortcut, dialog, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

// const path = require('path');
// const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

const openFileOrFolder = () => {
	// opening file dialog
	const uris = dialog.showOpenDialog({
		properties: ['openFile', 'openDirectory'],
		filters: [
			{ name: 'Images', extensions: ['jpg', 'png', 'gif'] },
			{ name: 'Movies', extensions: ['mkv', 'avi', 'mp4'] }
		]
	});

	// if the user cancels, uri will be undefined
	if (uris) {
		const uri = uris[0];

		// preparing our JSON object
		/*
			TODO
			{
				folder: '/Users/Max',
				currentFileIndex: 0,
				filesInFolder: ['dog.jpeg', 'cat.png']
			}
		*/
		// the folder of the file selected by the user
		// if the user selected a folder it will just return the same value
		const folder = path.dirname(uri);

		// defaulting to first picture of the folder
		const payload = {
			currentFileIndex: 0,
			folder,
			filesInFolder: fs.readdirSync(folder)
		};

		// if the user selected a file instead of a folder, we update the index
		const stats = fs.lstatSync(uri);
		if (stats.isFile()) {
			payload.currentFileIndex = payload.filesInFolder.indexOf(path.basename(uri));
		}

		// sending to renderer process
		win.webContents.send('fileSelectedByUser', payload);
	}
};

function createWindow() {
	// Create the browser window.
	win = new BrowserWindow({ width: 800, height: 600 });

	// and load the index.html of the app.
	win.loadURL('http://localhost:3000');

	// Open the DevTools.
	// win.webContents.openDevTools();

	// Emitted when the window is closed.
	win.on('closed', () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		win = null;
	});

	// Register a 'CommandOrControl+O' shortcut listener to open a file or folder.
	globalShortcut.register('CommandOrControl+O', openFileOrFolder);

	// the "open file or folder" dialog can also be triggered from the React app
	ipcMain.on('openFileOrFolder', openFileOrFolder);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

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
