import React from 'react';
import SliderItem from './SliderItem';
import './Slider.css';
import FileInfoContext from '../../FileInfoContext';

const Slider = () => (
	<div className="slider">
		<FileInfoContext.Consumer>
			{({ folder, filesInFolder, currentFileIndex, onSliderClick }) => {
				const imagesLinks = filesInFolder.map((imageAddress, fileIndex) => (
					// creating a sliderItem component for each image. It allows to manage it individually, for example to give it focus.
					<SliderItem
						currentFocusIndex={currentFileIndex}
						thisFileIndex={fileIndex}
						onSliderClick={onSliderClick}
						imgAddress={`file://${folder}/${imageAddress}`}
					/>
				));
				return <div className="slider-list">{imagesLinks}</div>;
			}}
		</FileInfoContext.Consumer>
	</div>
);

export default Slider;
