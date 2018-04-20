import React from 'react';

import './App.css';
import PictureViewer from './components/PictureViewer';
import NavLeft from './components/NavLeft';
import NavRight from './components/NavRight';
import Slider from './components/Slider';

const electron = window.require('electron');
// const fs = electron.remote.require('fs');
const { ipcRenderer } = electron;

class App extends React.Component {
	constructor() {
		super();
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
			<div className="App">
				<PictureViewer />
				<NavLeft />
				<NavRight />
				<Slider />
			</div>
		);
	}
}

export default App;
