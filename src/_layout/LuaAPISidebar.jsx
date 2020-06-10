import React, { Component } from "react"
import { NavLink } from "react-router-dom"

class Sidebar extends Component {

	updateHash(hash){
		window.location.hash = "#" + hash
		this.scroll_window_after_hashchange(hash)
	}

	scroll_window_after_hashchange(hash){
		hash = (hash || window.location.hash)

		if (hash) {
			hash = hash.replace("#","")
			const el = document.getElementById(hash)
			if (el){
				const y_offset = el.offsetTop
				if (y_offset){
					const topbar_height = this.props.mobile_nav ? 128 : 75
					window.scrollTo(0, y_offset-topbar_height)
				}
			}
		}
	}

	sidebarSection(index, hash, text, key){
		if (index === null){
			return(
				<section>
					<h5>
						<span onClick={() => this.updateHash(hash)}>{text}</span>
					</h5>
				</section>
			)
		}

		const items = this.props[key].map(function(item, i){
			return <li key={item + i}><NavLink to={"#" + hash + "-" + item}>{item}</NavLink></li>
		})

		return(
			<section>
				<h5
					className="collapsed expandable" id={"heading-"  + index}
					data-toggle="collapse" data-target={"#collapse-" + index}
					aria-expanded="false" aria-controls={"collapse-" + index}
				>
					<span onClick={() => this.updateHash(hash)}>{text}</span>
				</h5>

				<div id={"collapse-" + index} className="collapse no-transition" aria-labelledby={"heading-" + index}>
					<ul>{items}</ul>
				</div>
			</section>
		)
	}


	render() {

		// oof
		if (!this.props.actors || !this.props.screens || !this.props.smClasses || !this.props.singletons || !this.props.namespaces || !this.props.enums){ return null }

		return (
			<div id="LuaAPISidebar">

				<div className="d-none d-md-block sticky-top sidebar-filter">
					<div className="version">
						<span className="smversion">StepMania {this.props.smVersion.release}</span> &nbsp;
						<span className="githash">commit <a href={"https://github.com/stepmania/stepmania/tree/" + this.props.smVersion.githash} target="_blank" rel="noopener noreferrer">{this.props.smVersion.githash}</a></span>
					</div>

					<hr />
				</div>

				{this.sidebarSection(1, "Actors", "Actors", "actors")}
				{this.sidebarSection(2, "Screens", "Screens", "screens")}
				{this.sidebarSection(3, "Classes", "Other Classes", "smClasses")}
				{this.sidebarSection(4, "Singletons", "Singletons", "singletons")}

				<hr />

				{this.sidebarSection(5, "Namespaces", "Namespaces", "namespaces")}
				{this.sidebarSection(6, "Enums", "Enums", "enums")}

				<hr />

				{this.sidebarSection(null, "GlobalFunctions", "Global Functions")}
				{this.sidebarSection(null, "Constants", "Constants")}
			</div>
		)
	}
}

export default Sidebar;