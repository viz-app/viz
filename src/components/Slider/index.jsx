import React from 'react';
import SliderItem from './SliderItem';
import './Slider.css';
import FileInfoContext from '../../FileInfoContext';

const Slider = () => (
	<div className="slider">
		<FileInfoContext.Consumer>
			{({ folder, filesInFolder, currentFileIndex, onSliderClick }) => {
				const imagesLinks = filesInFolder.map((imageAddress, fileIndex) => (
					// <span
					// 	className="slider-item"
					// 	key={`${filesInFolder[fileIndex]}`}
					// 	onClick={() => onSliderClick(fileIndex)}
					// 	onKeyPress={() => onSliderClick(fileIndex)}
					// 	role="button"
					// 	tabIndex={0}
					// >
					// 	<img className="slider-img" alt="some picz" src={`file://${folder}/${imageAddress}`} />
					// </span>
					<SliderItem
						currentFocusIndex={currentFileIndex}
						thisFileIndex={fileIndex}
						onSliderClick={onSliderClick}
						address={`file://${folder}/${imageAddress}`}
					/>
				));
				return <div className="slider-list">{imagesLinks}</div>;
			}}
		</FileInfoContext.Consumer>
	</div>
);

export default Slider;
