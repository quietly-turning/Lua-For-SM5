import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import "./_styles/custom.css";

import Header from "./_layout/Header";
import ContentNavigation from "./_layout/ContentNavigation";

import Home from "./Home";
import LuaAPI from "./LuaAPI/LuaAPI";
import Resources from "./Resources";

import Foreword from "./introduction/Foreword";
import Lua from "./introduction/Lua";
import SupportedFileExtensions from "./introduction/Supported-File-Extensions";
import ModChartSetup from "./introduction/Mod-Chart-Setup";

import Quad from "./actors/Quad";
import BitmapText from "./actors/BitmapText";
import Sprite from "./actors/Sprite";
import Actor from "./actors/Actor";
import LoadActor from "./actors/LoadActor";
import Sound from "./actors/Sound";
import ActorMultiVertex from "./actors/ActorMultiVertex";
import ActorFrameTexture from "./actors/ActorFrameTexture";
import Model from "./actors/Model"


import SCREENMAN from "./singletons/SCREENMAN";
import SOUND from "./singletons/SOUND";

import Debugging from "./best-practices/Debugging";
import CommandChaining from "./best-practices/Command-Chaining";

import ArbitraryInput from "./examples/ArbitraryInput";
import SimpleTweens from "./examples/SimpleTweens";

class App extends Component {

	constructor(props) {
		super(props)
		this.handleFilterChange = this.handleFilterChange.bind(this)

		// the LuaAPI doesn't need to be filtered and re-filtered with each new keyup event
		// instead, wait 200ms for keyup events to cease before calling filterResults()
		// these variables are used as part of that 0.2 second timeout system
		// see: https://stackoverflow.com/a/5926782
		this.typingTimer = null
		this.doneTypingInterval = 200

		this.state = {
			api_filter: ""
		}
	}

	handleFilterChange(eventValue){

		const app = this

		clearTimeout(this.typingTimer)

		this.typingTimer = setTimeout(
			function() {
				app.setState({api_filter: eventValue.toUpperCase()})
			},
			this.doneTypingInterval
		)
	}

	render() {

		return (
			<div className="h-100">
				<Header />

				<div className="container-fluid h-100">
					<div className="row h-100">

						<div className="d-none col-xl-1 d-xl-block"></div>

						<div id="content" className="col-xl-7 col-lg-9 col-md-9 col-sm-12">
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

							<p>&nbsp;</p>
	 					</div>

						<div className="d-none col-xl-1 d-xl-block"></div>

	 					<div className="col-xl-auto col-lg-2 col-md-3 col-sm-12">
		 			  		<ContentNavigation onFilterChange={this.handleFilterChange} />
						</div>
	 				</div>
				</div>
			</div>
		);
	}
}

export default App;