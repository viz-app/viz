import React from 'react';
import FontIcon from 'react-toolbox/lib/font_icon';

import './NavLeft.css';
import LeftBarHandlersContext from '../../LeftBarHandlersContext';

const NavLeft = () => (
	<div className="navLeft">
		<LeftBarHandlersContext.Consumer>
			{({ openHandler }) => (
				<span>
					<FontIcon className="icon" value="folder_open" onClick={openHandler} />
					{/* XXX re-enable when we're ready */}
					{/* <FontIcon className="icon" value="settings" /> */}
				</span>
			)}
		</LeftBarHandlersContext.Consumer>
	</div>
);

export default NavLeft;
