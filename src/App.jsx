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
	init,
	getUserPreference
} from './helpers/IndexedDB';
import LeftBarHandlersContext from './LeftBarHandlersContext';
import RightBarHandlersContext from './RightBarHandlersContext';

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
				currentFileRotation: 0,
				filesInFolder: [],
				onLeftArrow: this.decrIndex,
				onSliderClick: this.changeIndex,
				onRightArrow: this.incrIndex
			},
			deleteNoConfirmation: false,
			defaultPicturePath: null,
			leftBarHandlers: {
				openHandler: this.openFileOrFolder
			},
			rightBarHandlers: {
				rotateHandler: this.rotateImage,
				deleteHandler: this.deleteImage
			}
		};
	}

	componentDidMount() {
		ipcRenderer.on('fileSelectedByUser', (event, arg) => {
			const fileInfoCopy = fromJS(this.state.fileInfo);
			// prints whatever file has been selected by the user
			console.log(`file selected by user ${JSON.stringify(arg)}`);

			this.setState({
				// TODO add the current rotation (fetch it in the indexedDB)
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
		ipcRenderer.on('RotateLeft', (event, arg) => {
			console.log(`Command+[ pressed ${arg}`);
			// linking command+[ to a Left Rotation
			this.rotateImage(false);
		});
		ipcRenderer.on('RotateRight', (event, arg) => {
			console.log(`Command+] pressed ${arg}`);
			// linking command+] to a Right Rotation
			this.rotateImage(true);
		});
		ipcRenderer.on('requestToDeleteCurrentFile', this.deleteImage);
		ipcRenderer.on('imageDeleted', (event, arg) => {
			// the argument is the index of the file that was correctly deleted
			const fileInfoCopy = fromJS(this.state.fileInfo);
			const filesInFolderCopy = fromJS(this.state.fileInfo.filesInFolder);

			// if the current picture is not the last one, move to next picture, else move to previous picture
			const nextIndex =
				this.state.fileInfo.currentFileIndex === this.state.fileInfo.filesInFolder.length - 1
					? this.state.fileInfo.filesInFolder.length - 2
					: this.state.fileInfo.currentFileIndex;

			this.setState({
				fileInfo: fileInfoCopy
					.set('filesInFolder', filesInFolderCopy.deleteIn([arg]).toJS())
					.set('currentFileIndex', nextIndex)
					.toJS()
			});
		});

		init().then(() => {
			getUserPreference(DELETE_NO_CONFIRMATION).then(deleteNoConfirmation =>
				this.setState({ deleteNoConfirmation })
			);
			getUserPreference(DEFAULT_PICTURES_PATH).then(defaultPicturePath => {
				// updating the state
				this.setState({ defaultPicturePath });

				// and opening the default folder by default
				ipcRenderer.send('openFileOrFolder', defaultPicturePath);
			});
		});
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
		// TODO update it to fetch rotate value in indexedDB
		this.setState({
			fileInfo: fileInfoCopy
				.set('currentFileIndex', incrementedIndex)
				.set('currentFileRotation', 0)
				.toJS()
		});
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
		this.setState({
			fileInfo: fileInfoCopy
				.set('currentFileIndex', decrementedIndex)
				.set('currentFileRotation', 0)
				.toJS()
		});
	};

	changeIndex = newIndex => {
		// creating an immutable object from fileInfo
		const fileInfoCopy = fromJS(this.state.fileInfo);
		// setting the state with a modified fileInfoCopy
		this.setState({ fileInfo: fileInfoCopy.set('currentFileIndex', newIndex).toJS() });
	};

	openFileOrFolder = () => {
		ipcRenderer.send('openFileOrFolder');
	};

	// function to handle image rotation
	rotateImage = isRotateRight => {
		// creating an immutable object from fileInfo
		const fileInfoCopy = fromJS(this.state.fileInfo);
		// based on whether it shall turn right or left, it sets the state to the correct value
		let currentRotation = fileInfoCopy.get('currentFileRotation');
		if (isRotateRight) {
			currentRotation = (currentRotation + 90) % 360;
		} else {
			currentRotation = currentRotation - 90 === -90 ? 270 : currentRotation - 90;
		}

		this.setState({ fileInfo: fileInfoCopy.set('currentFileRotation', currentRotation).toJS() });
		// TODO store the rotation state in indexedDB
		// TODO add a rotation function that takes the angle as an argument for loading from indexedDB purpose
	};

	deleteImage = () => {
		ipcRenderer.send('deleteImage', {
			filepath: `${this.state.fileInfo.folder}/${
				this.state.fileInfo.filesInFolder[this.state.fileInfo.currentFileIndex]
			}`,
			index: this.state.fileInfo.currentFileIndex
		});
	};

	render() {
		return (
			<FileInfoContext.Provider value={this.state.fileInfo}>
				<div className="App">
					<PictureViewer />
					<LeftBarHandlersContext.Provider value={this.state.leftBarHandlers}>
						<NavLeft />
					</LeftBarHandlersContext.Provider>
					<RightBarHandlersContext.Provider value={this.state.rightBarHandlers}>
						<NavRight />
					</RightBarHandlersContext.Provider>
					<Slider />
					{/* TODO remove this next div, it is just here for debugging purpose */}
					<div style={{ display: 'none' }}>{JSON.stringify(this.state)}</div>
				</div>
			</FileInfoContext.Provider>
		);
	}
}

export default App;
