import React, { Component } from "react";
import Sidebar from "./Sidebar";

class ContentNavigation extends Component {

	constructor(props) {
		super(props)
		this.handleFilterChange = this.handleFilterChange.bind(this)
	}

	handleFilterChange(eventValue){
		this.props.onFilterChange(eventValue)
	}

	render() {
		return (
			<div>
				<div id="sidebar" className="accordion w-100 h-100 position-fixed">
					<Sidebar onFilterChange={this.handleFilterChange} />
				</div>
			</div>
		);
	}
}

export default ContentNavigation;