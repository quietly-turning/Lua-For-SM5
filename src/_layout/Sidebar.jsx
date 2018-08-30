import React, { Component } from "react"
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
		const url_pieces = window.location.pathname.split("/")

		if (url_pieces[url_pieces.length-1] === "LuaAPI"){
			return <LuaAPISidebar onFilterChange={this.handleFilterChange} />
		}

		return <GuidesSidebar />
	}
}

export default Sidebar;