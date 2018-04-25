/* eslint "jsx-a11y/click-events-have-key-events": "off", "jsx-a11y/no-static-element-interactions": "off" */
import React from 'react';
import FontIcon from 'react-toolbox/lib/font_icon';
import './PictureViewer.css';
import FileInfoContext from './../../FileInfoContext';

const PictureViewer = () => (
	<div className="pictureViewer">
		{/* creating a consumer for the context to display the current image */}
		<FileInfoContext.Consumer>
			{({ folder, currentFileIndex, filesInFolder, onLeftArrow, onRightArrow }) => (
				<div className="bufferDiv">
					<div className="arrow left-arrow" onClick={onLeftArrow}>
						<FontIcon className="icon" value="keyboard_arrow_left" />
					</div>
					<img alt="" src={`file://${folder}/${filesInFolder[currentFileIndex]}`} />
					<div className="arrow right-arrow" onClick={onRightArrow}>
						<FontIcon className="icon" value="keyboard_arrow_right" />
					</div>
				</div>
			)}
		</FileInfoContext.Consumer>
	</div>
);

export default PictureViewer;
