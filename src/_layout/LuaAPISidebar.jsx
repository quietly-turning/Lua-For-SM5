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

		return (
			<div id="LuaAPISidebar">

				<div className="d-none d-md-block">
					<LuaAPIFilter onFilterChange={this.handleFilterChange} />
					<hr />
				</div>


				<section>
					<h5 id="heading-1" className="collapsed" data-toggle="collapse" data-target="#collapse-1" aria-expanded="false" aria-controls="collapse-1">
						<a href="#Actors">Classes</a>
					</h5>

					<div id="collapse-1" className="collapse no-transition" aria-labelledby="heading-1">
						<ul>{this.actor_classes}</ul>
					</div>
				</section>


				<section>
					<h5 id="heading-2" className="collapsed" data-toggle="collapse" data-target="#collapse-2" aria-expanded="false" aria-controls="collapse-2">
						<a href="#Namespaces">Namespaces</a>
					</h5>

					<div id="collapse-2" className="collapse no-transition" aria-labelledby="heading-2">
						<ul>{this.namespaces}</ul>
					</div>
				</section>


				<section>
					<h5 id="heading-3" className="collapsed" data-toggle="collapse" data-target="#collapse-3" aria-expanded="false" aria-controls="collapse-3">
						<a href="#Enums">Enums</a>
					</h5>

					<div id="collapse-3" className="collapse no-transition" aria-labelledby="heading-3">
						<ul>{this.enums}</ul>
					</div>
				</section>


				<h5>
					<a href="#Singletons">Singletons</a>
				</h5>
				<h5>
					<a href="#GlobalFunctions">Global Functions</a>
				</h5>
				<h5>
					<a href="#Constants">Constants</a>
				</h5>
			</div>
		)
	}
}

export default Sidebar;