import React from 'react';
import FontIcon from 'react-toolbox/lib/font_icon';

import './NavRight.css';

const NavRight = () => (
	<div className="navRight">
		<span>
			<FontIcon className="icon" value="delete" />
			<FontIcon className="icon" value="share" />
			<FontIcon className="icon" value="rotate_left" />
			<FontIcon className="icon" value="rotate_right" />
		</span>
	</div>
);

export default NavRight;
