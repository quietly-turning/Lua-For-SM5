import React, { Component } from "react";
import Sidebar from "./Sidebar";

class ContentNavigation extends Component {
	render() {
		return (
			<div>
				<div id="sidebar" className="accordion w-100 h-100 position-fixed">
					<Sidebar />
				</div>
			</div>
		);
	}
}

export default ContentNavigation;