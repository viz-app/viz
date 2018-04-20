import React from 'react';
import { fromJS } from 'immutable';

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
				filesInFolder: ['dog.jpeg', 'cat.png', 'duck.png']
			}
		};
		ipcRenderer.on('fileSelectedByUser', (event, arg) => {
			// prints whatever file has been selected by the user
			console.log(`file selected by user ${JSON.stringify(arg)}`);
			this.setState({ fileInfo: arg });
			// TODO actually set the state / context, load the image,etc.
		});
		ipcRenderer.on('leftKeyPressed', (event, arg) => {
			console.log(`Left key pressed ${arg}`);
			this.decrIndex();
			console.log(this.state.fileInfo.currentFileIndex);
		});
		ipcRenderer.on('rightKeyPressed', (event, arg) => {
			console.log(`Right key pressed ${arg}`);
			this.incrIndex();
			console.log(this.state.fileInfo.currentFileIndex);
		});

		this.incrIndex = this.incrIndex.bind(this);
		this.decrIndex = this.decrIndex.bind(this);
	}

	incrIndex() {
		const fileInfoCopy = fromJS(this.state.fileInfo);
		let incrementedIndex = fileInfoCopy.get('currentFileIndex');
		if (incrementedIndex === this.state.fileInfo.filesInFolder.length - 1) {
			incrementedIndex = 0;
		} else {
			incrementedIndex++;
		}
		this.setState({ fileInfo: fileInfoCopy.set('currentFileIndex', incrementedIndex).toJS() });
	}

	decrIndex() {
		const fileInfoCopy = fromJS(this.state.fileInfo);
		let decrementedIndex = fileInfoCopy.get('currentFileIndex');
		if (decrementedIndex === 0) {
			decrementedIndex = this.state.fileInfo.filesInFolder.length - 1;
		} else {
			decrementedIndex--;
		}
		this.setState({ fileInfo: fileInfoCopy.set('currentFileIndex', decrementedIndex).toJS() });
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
