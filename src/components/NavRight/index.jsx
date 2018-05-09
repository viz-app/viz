import React from 'react';
import FontIcon from 'react-toolbox/lib/font_icon';

import './NavRight.css';
import RightBarHandlersContext from './../../RightBarHandlersContext';

const NavRight = () => (
	<div className="navRight">
		<RightBarHandlersContext.Consumer>
			{({ rotateHandler }) => (
				<span>
					<FontIcon className="icon" value="delete" />
					<FontIcon className="icon" value="share" />
					<FontIcon
						className="icon"
						value="rotate_left"
						onClick={() => {
							rotateHandler(false);
						}}
					/>
					<FontIcon
						className="icon"
						value="rotate_right"
						onClick={() => {
							rotateHandler(true);
						}}
					/>
				</span>
			)}
		</RightBarHandlersContext.Consumer>
	</div>
);

export default NavRight;
