import React from 'react';
import './PictureViewer.css';
import FileInfoContext from './../../FileInfoContext';

const PictureViewer = () => (
	<div className="pictureViewer">
		<FileInfoContext.Consumer>
			{({ folder, currentFileIndex, filesInFolder }) => (
				<img alt="" src={`file://${  folder  }/${  filesInFolder[currentFileIndex]}`} />
			)}
		</FileInfoContext.Consumer>
	</div>
);

export default PictureViewer;
