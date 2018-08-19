import React, { Component } from "react"
import GuidesSidebar from "./GuidesSidebar"
import LuaAPISidebar from "./LuaAPISidebar"

class Sidebar extends Component {

	constructor(){
		super()
		// listen for window resizing and move the sizebar accordingly
		window.addEventListener("resize", this.HandleResize)
	}

	HandleResize(){
		const md = 768;
		if (window.innerWidth < md){
			document.getElementById("sidebar").classList.remove("position-fixed");
		} else {
			document.getElementById("sidebar").classList.add("position-fixed");
		}
	}

	render() {
		const url_pieces = window.location.pathname.split("/")

		if (url_pieces[url_pieces.length-1] === "LuaAPI"){
			return <LuaAPISidebar />
		}

		return <GuidesSidebar />
	}
}

export default Sidebar;