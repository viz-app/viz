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
			// fileInfo with default values
			// TODO: maybe find better default values
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
			// linking the left key to an index decrement
			this.decrIndex();
		});
		ipcRenderer.on('rightKeyPressed', (event, arg) => {
			console.log(`Right key pressed ${arg}`);
			// linking the right key to an index increment
			this.incrIndex();
		});

		// binders for our handler functions
		this.incrIndex = this.incrIndex.bind(this);
		this.decrIndex = this.decrIndex.bind(this);
	}

	incrIndex() {
		// function to increment the index
		// creating an immutable object from fileInfo
		const fileInfoCopy = fromJS(this.state.fileInfo);
		// getting the current index
		let incrementedIndex = fileInfoCopy.get('currentFileIndex');
		// managing the edge case, then the usual case
		if (incrementedIndex === this.state.fileInfo.filesInFolder.length - 1) {
			incrementedIndex = 0;
		} else {
			incrementedIndex++;
		}
		// setting the state with a modified fileInfoCopy
		this.setState({ fileInfo: fileInfoCopy.set('currentFileIndex', incrementedIndex).toJS() });
	}

	decrIndex() {
		// function to increment the index
		// creating an immutable object from fileInfo
		const fileInfoCopy = fromJS(this.state.fileInfo);
		// getting the current index
		let decrementedIndex = fileInfoCopy.get('currentFileIndex');
		// managing the edge case, then the usual case
		if (decrementedIndex === 0) {
			decrementedIndex = this.state.fileInfo.filesInFolder.length - 1;
		} else {
			decrementedIndex--;
		}
		// setting the state with a modified fileInfoCopy
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
