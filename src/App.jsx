import React from 'react';

import './App.css';
import PictureViewer from './components/PictureViewer';
import NavLeft from './components/NavLeft';
import NavRight from './components/NavRight';
import Slider from './components/Slider';
import FileInfoContext from './FileInfoContext';

const electron = window.require('electron');
// const fs = electron.remote.require('fs');
const { ipcRenderer } = electron;

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			fileInfo: {
				folder: '/Users/Max',
				currentFileIndex: 0,
				filesInFolder: ['dog.jpeg', 'cat.png']
			}
		};
		ipcRenderer.on('fileSelectedByUser', (event, arg) => {
			// prints whatever file has been selected by the user
			console.log(`file selected by user ${JSON.stringify(arg)}`);
			// TODO actually set the state / context, load the image,etc.
		});
		ipcRenderer.on('leftKeyPressed', (event, arg) => {
			console.log(`Left key pressed ${arg}`);
			// TODO actually change the state
		});
		ipcRenderer.on('rightKeyPressed', (event, arg) => {
			console.log(`Right key pressed ${arg}`);
			// TODO actually change the state
		});
	}

	openFileOrFolder = () => {
		ipcRenderer.send('openFileOrFolder');
	};

	render() {
		return (
			<FileInfoContext.Provider value={this.state.fileInfo}>
				<div className="App">
					<PictureViewer />
					<NavLeft />
					<NavRight />
					<Slider />
				</div>
			</FileInfoContext.Provider>
		);
	}
}

export default App;
