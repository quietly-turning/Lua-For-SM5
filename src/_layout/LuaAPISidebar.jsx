import React, { Component } from "react"
import { NavLink } from "react-router-dom"


// create a default url for API retrieval
// the user can change this later using a <select> element
const base     = "https://raw.githubusercontent.com/"

const project  = "stepmania/stepmania"
const git_hash = "HEAD"
const default_url = {
	github_user: "stepmania",
	github_project: "stepmania",
	github_hash: "HEAD"
}

const build_url = (base, github_user, github_project, github_hash) => {
	return `${base}${github_project}/${github_user}/${github_hash}/Docs/Luadoc/`
}

class Sidebar extends Component {
	constructor(props){
		super(props)
		this.state = { selectedAPIurl: null }
    this.handleSelectChange = this.handleSelectChange.bind(this);
		
		// XXX
		this.actorsCount = 0
		this.screensCount= 0
	}

	componentDidMount(){
		this.setState({ selectedAPIurl: build_url(base, default_url.github_user, default_url.github_project, default_url.github_hash)})
	}

	handleSelectChange(event) {
		this.setState({ selectedAPIurl: event.target.value }, ()=>{
			this.props.setSelectedAPI( {selectedAPIurl: this.state.selectedAPIurl} )
		})
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

	selectOptions(){
		const options = this.props.supportedAPIs.map(supportedAPI => {

			const github_user    = supportedAPI.github.user
			const github_project = supportedAPI.github.project

			return supportedAPI.versions.map(version => {
				const git_hash = version.githash

				return (
					// each <option>'s value is corresponding github url
					<option
						key={supportedAPI.name + "-" + version.name}
						value={ build_url(base, github_user, github_project, git_hash) }
					>
						{supportedAPI.name} {version.name}
					</option>
				)
			})
		})

		// console.log(options)
		return options
	}


	sidebarSection(index, hash, text, key){

		// GlobalFunctions and Constants
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

		// -------------------------------------------------------
		// XXX: backwards-compat for older versions of the API doc

		// older version of the API docs did not distinguish between [Actors, Screens, Other Classes]
		// and only had Classes.  in those cases, Actors and Screens will be empty arrays.
				
		if (index === 1){ this.actorsCount = items.length }
		else if (index === 2){ this.screensCount = items.length }
		
		if (items.length == 0){			
			return <section />
		}
		
		// change sidebar header text from "Other Classes" to "Classes"
		if (index === 3) {
			if (this.actorsCount==0 && this.screensCount==0){
				text = "Classes"
			}
		}
		// XXX: end backwards-compat ------------------------------
		

		return(
			<section>
				<h5
					className="collapsed expandable" id={"heading-"  + index}
					data-bs-toggle="collapse" data-bs-target={"#collapse-" + index}
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
		if (!this.props.actors || !this.props.screens || !this.props.smClasses || !this.props.singletons || !this.props.namespaces || !this.props.enums || !this.props.supportedAPIs){ return null }

    if (this.state === undefined || this.props.isAPILoaded === false){
			return(
				<div id="LuaAPISidebar">
					<div className="sidebar-API-version"></div>
				</div>
			)
		}


		return (
			<div id="LuaAPISidebar">

				<div className="sidebar-API-version">

					<select value={this.state.selectedAPIurl} onChange={this.handleSelectChange} className="form-select">
						{this.selectOptions()}
				  </select>

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