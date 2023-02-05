import { Component } from "react"
import { NavLink } from "react-router-dom"
import { supportedAPIs, supportedAPIsMap, default_key, default_url, url_base } from "../LuaAPI/modules/SupportedAPIs.js"

const param_key = "apiVersion"

// options for the <select>
const options = supportedAPIs.map(supportedAPI => {
	return supportedAPI.versions.map(version => {
		const val = supportedAPI.name + "-" + version.name
		return (
			<option key={val} value={val}>
				{supportedAPI.name} {version.name}
			</option>
		)
	})
})


// update GET params in window's URL
const set_search_params = (val) => {
	const urlParams = (new URL(window.location.href)).searchParams
	urlParams.set(param_key, val)

	// use history.pushState() to update the GET param without refreshing the window
  const newurl = window.location.protocol
									+ "//"
									+ window.location.host
									+ window.location.pathname
									+ '?'
									+ param_key + "=" + urlParams.get(param_key).toString()
									+ window.location.hash

  window.history.pushState({path: newurl}, '', newurl)
}

// build a url string that can be used to fetch an API doc from GitHub
// XXX: extract to SupportedAPIs.js module and dedup
const build_url = (github_user, github_project, github_hash) => {
	return `${url_base}${github_project}/${github_user}/${github_hash}/Docs/Luadoc/`
}

class Sidebar extends Component {
	constructor(props){
		super(props)

		const param = new URLSearchParams(window.location.search).get(param_key)
		if (supportedAPIsMap[param]){
			const [project, version] = supportedAPIsMap[param]
			const selected_url = build_url(project.github.user, project.github.project, version.githash)
			this.state = { selectedAPIurl: selected_url, selectedAPIurlKey: param}
			this.props.setSelectedAPI( {selectedAPIurl: selected_url} )
		} else {
			this.state = { selectedAPIurl: default_url,  selectedAPIurlKey: default_key}
		}

		this.handleSelectChange = this.handleSelectChange.bind(this);

		// XXX: kind of hacky — use these to count actors and screens
		// if they stay 0, it means the user requested an older version of the API doc
		// where everything was lumped together as a "class" and we should change the UI
		// text from "other classes" to just "classes" to accommodate
		this.actorsCount = 0
		this.screensCount= 0
	}

	componentDidMount(){
		this.set_state()
	}

	set_state(val){
		const param = val || (new URL(window.location.href)).searchParams.get(param_key)
		if (supportedAPIsMap[param]){
			const [project, version] = supportedAPIsMap[param]
			const selected_url = build_url(project.github.user, project.github.project, version.githash)

			this.setState({ selectedAPIurl: selected_url, selectedAPIurlKey: param}, () => {
				// pass the newly selected value back to LuaAPI component via callback function so it can update its state
				this.props.setSelectedAPI( {selectedAPIurl: selected_url} )
			})

		} else {
			this.setState({ selectedAPIurl: default_url,  selectedAPIurlKey: default_key}, () => {
				// pass the newly selected value back to LuaAPI component via callback function so it can update its state
				this.props.setSelectedAPI( {selectedAPIurl: default_url} )
			})
		}
	}

	handleSelectChange(event) {
		if (supportedAPIsMap[event.target.value]){
			// update GET params in window's URL
			set_search_params(event.target.value)

			// update this component's local state
			this.set_state(event.target.value)
		}
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

	sidebarHeader(){
    if (this.state === undefined || this.props.isAPILoaded === false){ return null }

		return (
			<div className="sticky-top sidebar-API-select">
				<select value={this.state.selectedAPIurlKey} onChange={this.handleSelectChange} className="form-select">
					{options}
			  </select>

				<hr />
			</div>
		)
	}

	sidebarSections(){
		// XXX: oof
		if (!this.props.actors || !this.props.screens || !this.props.smClasses || !this.props.singletons || !this.props.namespaces || !this.props.enums){ return null }

		return (
			<div>
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
		return (
			<div id="LuaAPISidebar">
				{this.sidebarHeader()}
				{this.sidebarSections()}
			</div>
		)
	}
}

export default Sidebar;