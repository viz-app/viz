import React from 'react';
import './Slider.css';
import FileInfoContext from '../../FileInfoContext';

const Slider = () => (
	<div className="slider">
		<FileInfoContext.Consumer>
			{({ folder, filesInFolder }) => {
				const imagesLinks = filesInFolder.map(imageAddress => (
					<li className="slider-item">
						<img alt="some picz" src={`file://${folder}/${imageAddress}`} />
					</li>
				));
				return <ul className="slider-list">{imagesLinks}</ul>;
			}}
		</FileInfoContext.Consumer>
	</div>
);

// const Slider = () => (
// <div className="slider">
// <FileInfoContext.Consumer>
//   {({ folder, currentFileIndex, filesInFolder })} => {
//     for (imageName of filesInFolder){

//     }
//   }
// </FileInfoContext.Consumer>
// </div>);

export default Slider;
