import React from 'react';
import PropTypes from 'prop-types';
import './Slider.css';

class SliderItem extends React.Component {
	constructor(props) {
		super(props);
		this.itemRef = React.createRef();
	}

	// needs to be done when the items are creating at SW initialization
	componentDidMount() {
		this.takeFocus();
	}

	// and everytime there is an update (triggered by a change in the global state, passed by the context)
	componentDidUpdate() {
		this.takeFocus();
	}

	// a function that uses the ref to the DOM to call the focus on this element, using the native .focus() method
	takeFocus() {
		if (this.props.currentFocusIndex === this.props.thisFileIndex) {
			this.itemRef.current.focus();
		}
	}

	// as Slider Item is only used in Slider, and there is only one layer of React components, methods and properties are passed directly through props
	render() {
		return (
			<span
				className="slider-item"
				onClick={() => this.props.onSliderClick(this.props.thisFileIndex)}
				onKeyPress={() => this.props.onSliderClick(this.props.thisFileIndex)}
				role="button"
				tabIndex={0}
				ref={this.itemRef}
			>
				<img className="slider-img" alt="some picz" src={this.props.imgAddress} />
			</span>
		);
	}
}

SliderItem.propTypes = {
	currentFocusIndex: PropTypes.number.isRequired,
	thisFileIndex: PropTypes.number.isRequired,
	onSliderClick: PropTypes.func.isRequired,
	imgAddress: PropTypes.string.isRequired
};

export default SliderItem;