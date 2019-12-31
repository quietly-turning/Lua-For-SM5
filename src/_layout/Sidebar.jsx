import React, { Component } from "react"
import { Route, Switch } from "react-router-dom"
import GuidesSidebar from "./GuidesSidebar"
import LuaAPISidebar from "./LuaAPISidebar"
import $ from "jquery"

class Sidebar extends Component {

	constructor(){
		super()
		// listen for window resizing and move the sizebar accordingly
		window.addEventListener("resize", this.HandleResize)

		this.handleFilterChange = this.handleFilterChange.bind(this)
	}

	HandleResize(){
		const md = 768

		if (window.innerWidth < md){
			$("#sidebar").removeClass("position-fixed")
		} else {
			$("#sidebar").addClass("position-fixed")
		}
	}

	handleFilterChange(eventValue){
		this.props.onFilterChange(eventValue)
	}

	render() {
		return(
			<Switch>
				<Route path="/LuaAPI">
					<LuaAPISidebar onFilterChange={this.handleFilterChange} />
				</Route>

				<GuidesSidebar />
			</Switch>
		)
	}
}

export default Sidebar;