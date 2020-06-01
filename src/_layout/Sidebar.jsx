import React, { Component } from "react"
import { Route, Switch } from "react-router-dom"
import GuidesSidebar from "./GuidesSidebar"
import LuaAPISidebar from "./LuaAPISidebar"

class Sidebar extends Component {

	render() {
		return(
			<Switch>
				<Route path="/LuaAPI">
					<LuaAPISidebar
						actors={this.props.actors}
						screens={this.props.screens}
						smClasses={this.props.smClasses}
						namespaces={this.props.namespaces}
						enums={this.props.enums}
						singletons={this.props.singletons}
						smVersion={this.props.smVersion}
					/>
				</Route>

				<GuidesSidebar />
			</Switch>
		)
	}
}

export default Sidebar;