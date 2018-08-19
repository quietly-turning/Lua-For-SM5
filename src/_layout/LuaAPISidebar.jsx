import React, { Component } from "react"

class Sidebar extends Component {
	render() {
		return (
			<div id="LuaAPISidebar">
				<h5>
					<a href="#ActorClasses">
						Actor Classes
					</a>
				</h5>
				<h5>
					<a href="#Namespaces">
						Namespaces
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
					<a href="#Enums">
						Enums
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