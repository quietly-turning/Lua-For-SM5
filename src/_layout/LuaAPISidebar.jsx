import React, { Component } from "react"
import LuaAPIFilter from "../LuaAPI/LuaAPIFilter"

class Sidebar extends Component {

	constructor(props) {
		super(props)
		this.handleFilterChange = this.handleFilterChange.bind(this)
	}

	handleFilterChange(eventValue){
		this.props.onFilterChange(eventValue)
	}

	render() {
		return (
			<div id="LuaAPISidebar">

				<div className="d-none d-md-block">
					<LuaAPIFilter onFilterChange={this.handleFilterChange} />
					<hr />
				</div>

				<h5>
					<a href="#Actors">
						Actor Classes
					</a>
				</h5>
				<h5>
					<a href="#Namespaces">
						Namespaces
					</a>
				</h5>
				<h5>
					<a href="#Enums">
						Enums
					</a>
				</h5>
				<h5>
					<a href="#Singletons">
						Singletons
					</a>
				</h5>
				<h5>
					<a href="#GlobalFunctions">
						Global Functions
					</a>
				</h5>
				<h5>
					<a href="#Constants">
						Constants
					</a>
				</h5>
			</div>
		)
	}
}

export default Sidebar;