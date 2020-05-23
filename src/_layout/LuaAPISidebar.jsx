import React, { Component } from "react"
import { NavLink } from "react-router-dom"
import LuaAPIFilter from "../LuaAPI/LuaAPIFilter"

class Sidebar extends Component {

	constructor(props) {
		super(props)
		this.handleFilterChange = this.handleFilterChange.bind(this)

		this.actor_classes = this.props.actorClasses
		this.namespaces    = this.props.namespaces
		this.enums         = this.props.enums
		this.singletons    = this.props.singletons
		this.sm_version    = {}
	}

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

	handleFilterChange(eventValue){
		this.props.onFilterChange(eventValue)
	}

	render() {

		// setting actor_classes, namespaces, and enums this way certainly feels like a hack
		if (this.props.actorClasses !== undefined){
			this.actor_classes = this.props.actorClasses.map(function(actorclass, i){
				return <li key={"actorclass"+i}><NavLink to={"#Actors-"+actorclass}>{actorclass}</NavLink></li>
			})
		}
		if (this.props.singletons !== undefined){
			this.singletons = this.props.singletons.map(function(singleton, i){
				return <li key={"singleton"+i}><NavLink to={"#Singletons-"+singleton}>{singleton}</NavLink></li>
			})
		}
		if (this.props.namespaces !== undefined){
			this.namespaces = this.props.namespaces.map(function(namespace, i){
				return <li key={"namespace"+i}><NavLink to={"#Namespaces-"+namespace}>{namespace}</NavLink></li>
			})
		}
		if (this.props.enums !== undefined){
			this.enums = this.props.enums.map(function(e, i){
				return <li key={"enum"+i}><NavLink to={"#Enums-"+e}>{e}</NavLink></li>
			})
		}
		if (this.props.smVersion !== undefined){
			this.sm_version.release = this.props.smVersion.release
			this.sm_version.githash = this.props.smVersion.githash
		 }

		return (
			<div id="LuaAPISidebar">

				<div className="d-none d-md-block sticky-top sidebar-filter">
					<div className="version">
						<span className="smversion">StepMania {this.sm_version.release}</span> &nbsp;
						<span className="githash">commit <a href={"https://github.com/stepmania/stepmania/tree/" + this.sm_version.githash} target="_blank" rel="noopener noreferrer">{this.sm_version.githash}</a></span>
					</div>

					<LuaAPIFilter onFilterChange={this.handleFilterChange} />
					<hr />
				</div>


				<section>
					<h5 id="heading-1" className="collapsed expandable" data-toggle="collapse" data-target="#collapse-1" aria-expanded="false" aria-controls="collapse-1">
						<span onClick={() => this.updateHash("Actors")}>Classes</span>
					</h5>

					<div id="collapse-1" className="collapse no-transition" aria-labelledby="heading-1">
						<ul>{this.actor_classes}</ul>
					</div>
				</section>


				<section>
					<h5 id="heading-2" className="collapsed expandable" data-toggle="collapse" data-target="#collapse-2" aria-expanded="false" aria-controls="collapse-2">
						<span onClick={() => this.updateHash("Singletons")}>Singletons</span>
					</h5>

					<div id="collapse-2" className="collapse no-transition" aria-labelledby="heading-2">
						<ul>{this.singletons}</ul>
					</div>
				</section>

				<section>
					<h5 id="heading-3" className="collapsed expandable" data-toggle="collapse" data-target="#collapse-3" aria-expanded="false" aria-controls="collapse-3">
						<span onClick={() => this.updateHash("Namespaces")}>Namespaces</span>
					</h5>

					<div id="collapse-3" className="collapse no-transition" aria-labelledby="heading-3">
						<ul>{this.namespaces}</ul>
					</div>
				</section>


				<section>
					<h5 id="heading-4" className="collapsed expandable" data-toggle="collapse" data-target="#collapse-4" aria-expanded="false" aria-controls="collapse-4">
						<span onClick={() => this.updateHash("Enums")}>Enums</span>
					</h5>

					<div id="collapse-4" className="collapse no-transition" aria-labelledby="heading-4">
						<ul>{this.enums}</ul>
					</div>
				</section>

				<section>
					<h5>
						<span onClick={() => this.updateHash("GlobalFunctions")}>Global Functions</span>
					</h5>
				</section>

				<section>
					<h5>
						<span onClick={() => this.updateHash("Constants")}>Constants</span>
					</h5>
				</section>
			</div>
		)
	}
}

export default Sidebar;