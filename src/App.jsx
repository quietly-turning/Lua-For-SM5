// ------- components for React
import React, { Component } from "react"
import { Route, Switch } from "react-router-dom"

// ------- primary stylesheet
import "./_styles/custom.css"

// ------- components for layout (header, sidebar)
import Header from "./_layout/Header"
import Sidebar from "./_layout/Sidebar"

// ------- components for top-level pages
import Home from "./Home"
import LuaAPI from "./LuaAPI/LuaAPI"
import Resources from "./Resources"

// ------- components for Guides
import Foreword from "./Guides/introduction/Foreword"
import Lua from "./Guides/introduction/Lua"
import SupportedFileExtensions from "./Guides/introduction/Supported-File-Extensions"
import ModChartSetup from "./Guides/introduction/Mod-Chart-Setup"

import Quad from "./Guides/actors/Quad"
import BitmapText from "./Guides/actors/BitmapText"
import Sprite from "./Guides/actors/Sprite"
import Actor from "./Guides/actors/Actor"
import LoadActor from "./Guides/actors/LoadActor"
import Sound from "./Guides/actors/Sound"
import ActorMultiVertex from "./Guides/actors/ActorMultiVertex"
import ActorFrameTexture from "./Guides/actors/ActorFrameTexture"
import Model from "./Guides/actors/Model"

import SCREENMAN from "./Guides/singletons/SCREENMAN"
import SOUND from "./Guides/singletons/SOUND"

import Debugging from "./Guides/best-practices/Debugging"
import CommandChaining from "./Guides/best-practices/Command-Chaining"

import ArbitraryInput from "./Guides/examples/ArbitraryInput"
import SimpleTweens from "./Guides/examples/SimpleTweens"

// -----------------------------------

class App extends Component {

	constructor(props) {
		super(props)
		this.handleFilterChange = this.handleFilterChange.bind(this)
		this.handleMobileNavToggle = this.handleMobileNavToggle.bind(this)

		this.state = {
			mobile_nav: false,
			api_filter: ""
		}
	}

	handleFilterChange(eventValue){
		this.setState({api_filter: eventValue})
	}

	handleMobileNavToggle(){
		this.setState({mobile_nav: !this.state.mobile_nav})
	}

	render() {

		return (
			<main className="h-100">
				<Header />

				<div className="container-fluid h-100">
					<div className="row h-100">

						<div className="sidebar position-fixed h-100 col-lg-2 col-md-3 d-md-block d-none">
							<Sidebar onFilterChange={this.handleFilterChange} />
						</div>

						<div id="content" className="offset-md-3 col-md-6 col-sm-12 pl-lg-0 pl-md-3 pl-4">
							<Switch>
								<Route exact path="/" 		component={Home} />
								<Route path="/LuaAPI"		render={(routeProps =>(<LuaAPI {...routeProps} {...this.state} />))} />
								<Route path="/resources"	component={Resources} />

								<Route path="/foreword"		component={Foreword}/>
								<Route path="/lua"			component={Lua} />
								<Route path="/Supported-File-Extensions"	component={SupportedFileExtensions} />
								<Route path="/Mod-Chart-Setup"	component={ModChartSetup} />

								<Route path="/Def.Quad"			component={Quad} />
								<Route path="/Def.BitmapText"	component={BitmapText} />
								<Route path="/Def.Sprite"		component={Sprite} />
								<Route path="/Def.Actor"		component={Actor} />
								<Route path="/LoadActor"		component={LoadActor} />
								<Route path="/Def.Sound"		component={Sound} />
								<Route path="/Def.ActorMultiVertex"		component={ActorMultiVertex} />
								<Route path="/Def.ActorFrameTexture"	component={ActorFrameTexture} />
								<Route path="/Def.Model"	component={Model} />

								<Route path="/SCREENMAN"	component={SCREENMAN} />
								<Route path="/SOUND"			component={SOUND} />

								<Route path="/Debugging"			component={Debugging} />
								<Route path="/Command-Chaining"	component={CommandChaining} />

								<Route path="/Arbitrary-Input"	component={ArbitraryInput} />
								<Route path="/Simple-Tweens"		component={SimpleTweens} />
							</Switch>
						</div>
					</div>
				</div>

				<div id="mobileNav" className="sidebar collapse no-transition w-100 h-100 d-md-none">
					<Sidebar onFilterChange={this.handleFilterChange} />
				</div>

				<button id="mobileNavToggle" className="btn btn-dark d-md-none" type="button" onClick={this.handleMobileNavToggle} data-toggle="collapse" data-target="#mobileNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
				  <div className={this.state.mobile_nav ? "x bar1" : "bar1"}></div>
				  <div className={this.state.mobile_nav ? "x bar2" : "bar2"}></div>
				  <div className={this.state.mobile_nav ? "x bar3" : "bar3"}></div>
				</button>
			</main>
		);
	}
}

export default App;