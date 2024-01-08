import { Component } from "react"
import { NavLink } from "react-router-dom"
import * as bootstrap from "bootstrap"
import { supportedAPIs, supportedAPIsMap, default_engineString, default_versionString, default_url, getAPIdocURL } from "../LuaAPI/modules/SupportedAPIs.js"

const urlParamKeys = {
	engine: "engine",
	version: "version"
}


// options for the engine <select>
const engineOptions = supportedAPIs.map(supportedAPI => {
	return (
		<option key={supportedAPI.name} value={supportedAPI.name}>
			{supportedAPI.name}
		</option>
	)
})

// update GET params in browser's URL
const set_GET_params = (engineString, versionString) => {
	const urlParams = (new URL(window.location.href)).searchParams

	urlParams.set(urlParamKeys.engine, engineString)
	urlParams.set(urlParamKeys.version, versionString)

	// use history.pushState() to update the GET param without refreshing the window
	// XXX: is there a vanilla-JS way to build a URL like this?
  const newurl = window.location.protocol
									+ "//"
									+ window.location.host
									+ window.location.pathname
									+ '?'
									+ urlParamKeys.engine  + "=" + engineString
									+ "&"
									+ urlParamKeys.version + "=" + versionString
									+ window.location.hash

  window.history.pushState({path: newurl}, '', newurl)
}

class Sidebar extends Component {
	constructor(props){
		super(props)

		const urlParams    = new URLSearchParams(window.location.search)
		const _engineString = urlParams.get(urlParamKeys.engine)
		const _versionString= urlParams.get(urlParamKeys.version)

		// basic validation in case user types non-existent engines/versions in the url
		const engineString = supportedAPIsMap[_engineString] ? _engineString : default_engineString
		const versionString = supportedAPIsMap[engineString][_versionString] ? _versionString : default_versionString
		set_GET_params(engineString, versionString)


		const urlString = getAPIdocURL(engineString, versionString)
		const version_options = engineString ? supportedAPIs.find(engine=>engine.name===engineString)?.versions : supportedAPIs[0].versions

		this.state = {
			selectedEngine:  engineString  ?? default_engineString,
			selectedVersion: versionString ?? default_versionString,
			selectedAPIurl:  urlString,
			versionOptions:  this.setVersionOptions( version_options ),
		}

		this.props.setSelectedAPI( {selectedAPIurl: urlString} )

		this.handleEngineSelectChange  = this.handleEngineSelectChange.bind(this);
		this.handleVersionSelectChange = this.handleVersionSelectChange.bind(this);

		// XXX: kind of hacky — use these to count actors and screens
		// if they stay 0, it means the user requested an older version of the API doc
		// where everything was lumped together as a "class" and we should change the UI
		// text from "other classes" to just "classes" to accommodate
		this.actorsCount = 0
		this.screensCount= 0
	}

	componentDidMount(){
		const urlParams     = new URLSearchParams(window.location.search)
		const engineString  = urlParams.get(urlParamKeys.engine)
		const versionString = urlParams.get(urlParamKeys.version)

		if (supportedAPIsMap[engineString] && supportedAPIsMap[engineString][versionString]){

			const selected_url = getAPIdocURL(engineString, versionString)

			this.setState({ selectedAPIurl: selected_url, selectedVersion: versionString}, () => {
				// pass the newly selected value back to LuaAPI component via callback function so it can update its state
				this.props.setSelectedAPI( {selectedAPIurl: selected_url, selectedAPIengine: engineString, selectedAPIversion: versionString} )
			})

		} else {
			this.setState({ selectedAPIurl: default_url,  selectedVersion: default_versionString}, () => {
				// pass the newly selected value back to LuaAPI component via callback function so it can update its state
				this.props.setSelectedAPI( {selectedAPIurl: default_url, selectedAPIengine: default_engineString, selectedAPIversion: default_versionString} )
			})
		}
	}



	// -------------------------------------------------------
	// handler for <select> with [StepMania, ITGMania]
	handleEngineSelectChange(event) {
		const engineName = event.target.value
		const engine = supportedAPIs.find(engine => engine.name === engineName)

		if (!(engineName && engine) ){ return false }

		this.setVersionOptions(engine.versions)

		// set local state and pass to LuaAPI component via callback so it can fetch, parse, and display
		this.setState({
			selectedEngine: engineName,
			selectedVersion: engine.versions[0].name,
			selectedAPIurl: getAPIdocURL(engineName, engine.versions[0].name)
		}, () => {
			this.props.setSelectedAPI({
				selectedAPIurl:     this.state.selectedAPIurl,
				selectedAPIengine:  this.state.selectedEngine,
				selectedAPIversion: this.state.selectedVersion,
			})

			if (supportedAPIsMap[this.state.selectedEngine] && supportedAPIsMap[this.state.selectedEngine][this.state.selectedVersion]){
				// update GET params in window's URL
				set_GET_params(this.state.selectedEngine, this.state.selectedVersion)
			}
		})
	}

	// helper function to generate <option> markup as part of `handleEngineSelectChange`
	setVersionOptions(versions){
		this.versionOptions = versions.map(version => {
			return (
				<option key={version.name} value={version.name}>
					{version.name}
				</option>
			)
		})
	}

	handleVersionSelectChange(event) {
		const versionString = event.target.value
		if (!versionString){ return false }

		// set local state and pass to LuaAPI component via callback so it can fetch, parse, and display
		this.setState({
			selectedVersion: versionString,
			selectedAPIurl:  getAPIdocURL(this.state.selectedEngine, versionString)
		}, ()=>{
			this.props.setSelectedAPI({
				selectedAPIurl:     this.state.selectedAPIurl,
				selectedAPIengine:  this.state.selectedEngine,
				selectedAPIversion: this.state.selectedVersion,
			})

			if (supportedAPIsMap[this.state.selectedEngine] && supportedAPIsMap[this.state.selectedEngine][this.state.selectedVersion]){
				// update GET params in window's URL
				set_GET_params(this.state.selectedEngine, this.state.selectedVersion)
			}
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

	sidebarHeader(){
    if (this.state === undefined || this.props.isAPILoaded === false){ return null }

		return (
			<div className="sticky-top sidebar-API-select">
				<select value={this.state.selectedEngine} onChange={this.handleEngineSelectChange} className="form-select" id="engine">
					{engineOptions}
			  </select>

				<select value={this.state.selectedVersion} onChange={this.handleVersionSelectChange} className="form-select" id="version">
					{this.versionOptions}
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

	handleKeyPress(event, hash, index){
		if (event.key==='Enter' || event.key==='ArrowLeft' || event.key==='ArrowRight'){
			const el = document.getElementById(`#collapse-${index}`)
			let bsCollapse = bootstrap.Collapse.getInstance(el)
			if (bsCollapse === null && hash !== "GlobalFunctions" && hash !== "Constants") {
				bsCollapse = new bootstrap.Collapse(`#collapse-${index}`, {toggle: false })
			}
			const headingEl = document.getElementById(`#heading-${index}`)

			if (event.key==='Enter'){
				this.updateHash(hash)
				if (bsCollapse) { bsCollapse.toggle() }
				if (headingEl){ headingEl.classList.toggle('collapsed')}

				const headingEl = document.getElementById(`heading-${index ?? hash}`)
				if (headingEl){ headingEl.firstChild.focus() }

			} else if (event.key==='ArrowLeft'){
				if (bsCollapse) { bsCollapse.hide() }
				if (headingEl){ headingEl.classList.add('collapsed')}

			} else if (event.key==='ArrowRight'){
				if (bsCollapse) { bsCollapse.show() }
				if (headingEl){ headingEl.classList.remove('collapsed')}
			}
		}
	}

	handleClick(hash, index){
		if (hash){ this.updateHash(hash) }
		const el = document.getElementById(`#collapse-${index}`)
		let bsCollapse = bootstrap.Collapse.getInstance(el)
		if (bsCollapse === null) { bsCollapse = new bootstrap.Collapse(`#collapse-${index}`, {toggle: false }) }
		bsCollapse.toggle()

		const headingEl = document.getElementById(`heading-${index}`)
		if (headingEl){ headingEl.classList.toggle('collapsed')}
	}

	sidebarSection(index, hash, text, key){

		// GlobalFunctions and Constants
		if (index === null){
			return(
				<section>
					<h5 id={"heading-"+hash} className={hash}>
						<span tabIndex="0"
							onKeyDown={(e) => this.handleKeyPress(e, hash, index) }
							onClick={() => this.updateHash(hash)}
						>
							{text}
						</span>
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
					onClick={(e) => this.handleClick(hash, index)}
					onKeyDown={(e) => this.handleKeyPress(e, hash, index) }
					aria-expanded="false" aria-controls={"collapse-" + index}
				>
					<span tabIndex="0">{text}</span>
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