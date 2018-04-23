import React from 'react';
import './PictureViewer.css';
import FileInfoContext from './../../FileInfoContext';

const PictureViewer = () => (
	<div className="pictureViewer">
		{/* creating a consumer for the context to display the current image */}
		<FileInfoContext.Consumer>
			{({ folder, currentFileIndex, filesInFolder }) => (
				<img alt="" src={`file://${folder}/${filesInFolder[currentFileIndex]}`} />
			)}
		</FileInfoContext.Consumer>
	</div>
);

export default PictureViewer;
