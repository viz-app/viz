import React from 'react';
import PropTypes from 'prop-types';
import './Slider.css';

class SliderItem extends React.Component {
	constructor(props) {
		super(props);
		this.itemRef = React.createRef();
	}

	componentDidMount() {
		if (this.props.currentFocusIndex === this.props.thisFileIndex) {
			this.itemRef.current.focus();
		}
	}

	componentDidUpdate() {
		if (this.props.currentFocusIndex === this.props.thisFileIndex) {
			this.itemRef.current.focus();
		}
	}

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
				<img className="slider-img" alt="some picz" src={this.props.address} />
			</span>
		);
	}
}

SliderItem.propTypes = {
	currentFocusIndex: PropTypes.number.isRequired,
	thisFileIndex: PropTypes.number.isRequired,
	onSliderClick: PropTypes.func.isRequired,
	address: PropTypes.string.isRequired
};

export default SliderItem;
