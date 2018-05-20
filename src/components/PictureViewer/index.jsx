// disabling this rule as we handle key events through electron API
/* eslint "jsx-a11y/click-events-have-key-events": "off" */
import React from 'react';
import FontIcon from 'react-toolbox/lib/font_icon';
import './PictureViewer.css';
import FileInfoContext from './../../FileInfoContext';

class PictureViewer extends React.Component {
	constructor(props) {
		super(props);
		this.viewerRef = React.createRef();
	}

	render() {
		return (
			<div className="pictureViewer">
				{/* creating a consumer for the context to display the current image */}
				<FileInfoContext.Consumer>
					{({
						folder,
						currentFileIndex,
						currentFileRotation,
						filesInFolder,
						onLeftArrow,
						onRightArrow
					}) => (
						<div className="bufferDiv" ref={this.viewerRef}>
							<img
								// TODO see if it is possible to scale only when necessary (image would go out of window)
								className={`rotate${currentFileRotation}`}
								style={{
									transform: `scale(${
										// this piece of code scales the image to fit in the screen
										// getBoundingClientRect() is a native API to get the size of an element
										currentFileRotation === 90 || currentFileRotation === 270
											? this.viewerRef.current.getBoundingClientRect().height /
											  this.viewerRef.current.getBoundingClientRect().width
											: 1
									} ) rotate(${currentFileRotation}deg)`
								}}
								alt={`some picz ${currentFileIndex}`}
								src={`file://${folder}/${filesInFolder[currentFileIndex]}`}
							/>
							<div className="arrow left-arrow" onClick={onLeftArrow} role="button" tabIndex="0">
								<FontIcon className="icon" value="keyboard_arrow_left" />
							</div>
							<div className="arrow right-arrow" onClick={onRightArrow} role="button" tabIndex="0">
								<FontIcon className="icon" value="keyboard_arrow_right" />
							</div>
						</div>
					)}
				</FileInfoContext.Consumer>
			</div>
		);
	}
}

export default PictureViewer;
