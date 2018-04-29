import React from 'react';
import { fromJS } from 'immutable';

import './App.css';
import PictureViewer from './components/PictureViewer';
import NavLeft from './components/NavLeft';
import NavRight from './components/NavRight';
import Slider from './components/Slider';
import FileInfoContext from './FileInfoContext';
import {
	DELETE_NO_CONFIRMATION,
	DEFAULT_PICTURES_PATH,
	getUserPreference
} from './helpers/IndexedDB';

const electron = window.require('electron');
// const fs = electron.remote.require('fs');
const { ipcRenderer } = electron;

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			// fileInfo with default values
			fileInfo: {
				folder: null,
				currentFileIndex: 0,
				filesInFolder: [],
				onLeftArrow: this.decrIndex,
				onRightArrow: this.incrIndex
			},
			deleteNoConfirmation: false,
			defaultPicturePath: null
		};
	}

	componentDidMount() {
		ipcRenderer.on('fileSelectedByUser', (event, arg) => {
			const fileInfoCopy = fromJS(this.state.fileInfo);
			// prints whatever file has been selected by the user
			console.log(`file selected by user ${JSON.stringify(arg)}`);

			this.setState({
				fileInfo: fileInfoCopy
					.set('folder', arg.folder)
					.set('currentFileIndex', arg.currentFileIndex)
					.set('filesInFolder', arg.filesInFolder)
					.toJS()
			});
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

		getUserPreference(DELETE_NO_CONFIRMATION).then(deleteNoConfirmation =>
			this.setState({ deleteNoConfirmation })
		);
		getUserPreference(DEFAULT_PICTURES_PATH).then(defaultPicturePath =>
			this.setState({ defaultPicturePath })
		);
	}

	/**
	 * Function to increment the index.
	 */
	incrIndex = () => {
		// creating an immutable object from fileInfo
		const fileInfoCopy = fromJS(this.state.fileInfo);
		// getting the current index
		let incrementedIndex = fileInfoCopy.get('currentFileIndex');
		// managing the edge case, then the usual case
		incrementedIndex = ++incrementedIndex % this.state.fileInfo.filesInFolder.length;
		// setting the state with a modified fileInfoCopy
		this.setState({ fileInfo: fileInfoCopy.set('currentFileIndex', incrementedIndex).toJS() });
	};

	/**
	 * Function to decrement the index.
	 */
	decrIndex = () => {
		// creating an immutable object from fileInfo
		const fileInfoCopy = fromJS(this.state.fileInfo);
		// getting the current index
		let decrementedIndex = fileInfoCopy.get('currentFileIndex');
		// managing the edge case, then the usual case
		decrementedIndex =
			decrementedIndex === 0 ? this.state.fileInfo.filesInFolder.length - 1 : --decrementedIndex;
		// setting the state with a modified fileInfoCopy
		this.setState({ fileInfo: fileInfoCopy.set('currentFileIndex', decrementedIndex).toJS() });
	};

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
					{/* TODO remove this next div, it is just here for debugging purpose */}
					<div style={{ display: 'none' }}>{JSON.stringify(this.state)}</div>
				</div>
			</FileInfoContext.Provider>
		);
	}
}

export default App;
