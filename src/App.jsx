// ------- components for React
import React, { Component } from "react"
import { Route, Routes }    from "react-router-dom"

// withRouter allows us access to app url history
// and, more importantly here, hook events into url changes
import { withRouter }       from "./withRouter.js"

// ------- primary stylesheet
import "./_styles/custom.css"

// ------- components for layout (header, sidebar)
import Header from "./_layout/Header"
import Sidebar from "./_layout/Sidebar"

// ------- components for pages

import Page from "./Page"
import LuaAPI from "./LuaAPI/LuaAPI"

// ------- highlightjs for syntax coloring
// import highlightjs modules last so that hljs.registerLanguage()
// doesn't trigger eslint-plugin-import's import/first rule
import hljs from "highlight.js/lib/core"
import "highlight.js/styles/monokai-sublime.css"
import lua from "highlight.js/lib/languages/lua"
import ini from "highlight.js/lib/languages/ini"
import xml from "highlight.js/lib/languages/xml"
hljs.registerLanguage('javascript', lua)
hljs.registerLanguage('javascript', ini)
hljs.registerLanguage('javascript', xml)

// -----------------------------------

class App extends Component {

	constructor(props) {
		super(props)

		this.handleMobileNavToggle = this.handleMobileNavToggle.bind(this)
		this.hideMobileNav         = this.hideMobileNav.bind(this)
		this.showMobileNav         = this.showMobileNav.bind(this)
		this.getClasses            = this.getClasses.bind(this)
		this.setSelectedAPI        = this.setSelectedAPI.bind(this)

		this.state = {
			mobile_nav: false,
			isAPILoaded: false,
		}
	}

	handleMobileNavToggle(){
		this.state.mobile_nav ?	this.hideMobileNav() : this.showMobileNav()
	}

	showMobileNav(){
		this.setState({mobile_nav: true})
		const bottomNavbarClasses = document.getElementById('mobileNav')?.classList
		bottomNavbarClasses.add('show')
	}

	hideMobileNav(){
		this.setState({mobile_nav: false})
		const bottomNavbarClasses = document.getElementById('mobileNav')?.classList
		const topNavbarClasses    = document.getElementById('navbarNav')?.classList
		bottomNavbarClasses.remove('show')
		topNavbarClasses.remove('show')
	}

	getClasses(data){
		this.setState({
			actors:        data.actors,
			screens:       data.screens,
			sm_classes:    data.sm_classes,
			namespaces:    data.namespaces,
			enums:         data.enums,
			singletons:    data.singletons,
			isAPILoaded:   data.isLoaded,
		})
	}

	setSelectedAPI(data){
		this.setState({
			selectedAPIurl:     data.selectedAPIurl,
			selectedAPIengine:  data.selectedAPIengine,
			selectedAPIversion: data.selectedAPIversion,
		})
	}

	render() {

		return (
			<main>
				<Header />

				<div className="pt-5">
					<div className="row no-gutters">

						<div tabIndex="-1" className="sidebar position-fixed h-100 col-md-3 d-md-block d-none">
							<Sidebar
								mobile={false}
								setSelectedAPI={this.setSelectedAPI}
								actors={this.state.actors}
								screens={this.state.screens}
								smClasses={this.state.sm_classes}
								namespaces={this.state.namespaces}
								enums={this.state.enums}
								singletons={this.state.singletons}
								isAPILoaded={this.state.isAPILoaded}
							/>
						</div>

						<div id="content" className="offset-md-3 col-xl-7 col-lg-8 col-md-9 col-sm-12 ps-lg-4 pe-lg-4 ps-md-5 pe-md-5 p-4">
							<Routes>
								<Route path="/"             element={<Page   hideMobileNav={this.hideMobileNav} />} />
								<Route path="/Resources"    element={<Page   hideMobileNav={this.hideMobileNav} />} />
								<Route path="/:group/:page" element={<Page   hideMobileNav={this.hideMobileNav} />} />
								<Route path="/LuaAPI"       element={<LuaAPI hideMobileNav={this.hideMobileNav} {...this.state} parentCallback={this.getClasses} />} />
							</Routes>
						</div>
					</div>
				</div>

				<div id="mobileNav" className="sidebar collapse no-transition w-100 h-100 d-md-none">
					<Sidebar
						mobile={true}
						setSelectedAPI={this.setSelectedAPI}
						actors={this.state.actors}
						screens={this.state.screens}
						smClasses={this.state.sm_classes}
						namespaces={this.state.namespaces}
						enums={this.state.enums}
						singletons={this.state.singletons}
						isAPILoaded={this.state.isAPILoaded}
					/>
				</div>

				<button id="mobileNavToggle" className="btn btn-dark d-md-none" type="button" onClick={this.handleMobileNavToggle} data-bs-toggle="collapse"  aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
				  <div className={this.state.mobile_nav ? "x bar1" : "bar1"}></div>
				  <div className={this.state.mobile_nav ? "x bar2" : "bar2"}></div>
				  <div className={this.state.mobile_nav ? "x bar3" : "bar3"}></div>
				</button>
			</main>
		);
	}
}

export default withRouter(App);