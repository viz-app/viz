import React from 'react';
import './App.css';
import PictureViewer from './components/PictureViewer';
import NavLeft from './components/NavLeft';
import NavRight from './components/NavRight';
import Slider from './components/Slider';

const App = () => (
	<div className="App">
		<PictureViewer />
		<NavLeft />
		<NavRight />
		<Slider />
	</div>
);

export default App;
