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
		this.getClasses            = this.getClasses.bind(this)

		this.state = {
			mobile_nav: false,
		}
	}

	handleMobileNavToggle(){
		this.setState({mobile_nav: !this.state.mobile_nav})
	}

	getClasses(data){
		this.setState({
			actors:     data.actors,
			screens:    data.screens,
			sm_classes: data.sm_classes,
			namespaces: data.namespaces,
			enums:      data.enums,
			singletons: data.singletons,
			sm_version: data.sm_version
		})
	}

	render() {

		return (
			<main>
				<Header />

				<div className="pt-5">
					<div className="row no-gutters">

						<div className="sidebar position-fixed h-100 col-md-3 d-md-block d-none">
							<Sidebar
								actors={this.state.actors}
								screens={this.state.screens}
								smClasses={this.state.sm_classes}
								namespaces={this.state.namespaces}
								enums={this.state.enums}
								singletons={this.state.singletons}
								smVersion={this.state.sm_version}
							/>
						</div>

						<div id="content" className="offset-md-3 col-xl-7 col-lg-8 col-md-9 col-sm-12 ps-lg-4 pe-lg-4 ps-md-5 pe-md-5 p-4">
							<Routes>
								<Route path="/"             element={<Page />} />
								<Route path="/Resources"    element={<Page />} />
								<Route path="/:group/:page" element={<Page />} />
								<Route path="/LuaAPI" element={<LuaAPI {...this.state} parentCallback={this.getClasses} />} />
							</Routes>
						</div>
					</div>
				</div>

				<div id="mobileNav" className="sidebar collapse no-transition w-100 h-100 d-md-none">
					<Sidebar
						actors={this.state.actors}
						screens={this.state.screens}
						smClasses={this.state.sm_classes}
						namespaces={this.state.namespaces}
						enums={this.state.enums}
						singletons={this.state.singletons}
						smVersion={this.state.sm_version}
					/>
				</div>

				<button id="mobileNavToggle" className="btn btn-dark d-md-none" type="button" onClick={this.handleMobileNavToggle} data-bs-toggle="collapse" data-bs-target="#mobileNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
				  <div className={this.state.mobile_nav ? "x bar1" : "bar1"}></div>
				  <div className={this.state.mobile_nav ? "x bar2" : "bar2"}></div>
				  <div className={this.state.mobile_nav ? "x bar3" : "bar3"}></div>
				</button>
			</main>
		);
	}
}

export default withRouter(App);