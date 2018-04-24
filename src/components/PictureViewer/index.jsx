import React from 'react';
import FontIcon from 'react-toolbox/lib/font_icon';
import './PictureViewer.css';
import FileInfoContext from './../../FileInfoContext';

const PictureViewer = () => (
	<div className="pictureViewer">
		<div className="arrow left-arrow">
			<span>
				<FontIcon className="icon" value="keyboard_arrow_left" />
			</span>
		</div>
		{/* creating a consumer for the context to display the current image */}
		<FileInfoContext.Consumer>
			{({ folder, currentFileIndex, filesInFolder }) => (
				<img alt="" src={`file://${folder}/${filesInFolder[currentFileIndex]}`} />
			)}
		</FileInfoContext.Consumer>
		<div className="arrow right-arrow">
			<span>
				<FontIcon className="icon" value="keyboard_arrow_right" />
			</span>
		</div>
	</div>
);

export default PictureViewer;
