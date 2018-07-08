import React from 'react';
import FontIcon from 'react-toolbox/lib/font_icon';

import './NavRight.css';
import RightBarHandlersContext from './../../RightBarHandlersContext';

// TODO should I create two functions for rotate to avoid definition at each render ? In the mean time, it is pretty much never re-rendered
const NavRight = () => (
	<div className="navRight">
		<RightBarHandlersContext.Consumer>
			{({ rotateHandler, deleteHandler }) => (
				<span>
					<FontIcon className="icon" value="delete" onClick={deleteHandler} />
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
