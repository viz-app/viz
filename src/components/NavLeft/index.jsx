import React from 'react';
import FontIcon from 'react-toolbox/lib/font_icon';

import './NavLeft.css';

const NavLeft = () => (
	<div className="navLeft">
		<span>
			<FontIcon className="icon" value="folder_open" />
			<FontIcon className="icon" value="settings" />
		</span>
	</div>
);

export default NavLeft;
