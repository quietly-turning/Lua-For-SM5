import React, { Component } from "react"
import { Route, Switch } from "react-router-dom"
import GuidesSidebar from "./GuidesSidebar"
import LuaAPISidebar from "./LuaAPISidebar"

class Sidebar extends Component {

	constructor(){
		super()
		this.handleFilterChange = this.handleFilterChange.bind(this)
	}


	handleFilterChange(eventValue){
		this.props.onFilterChange(eventValue)
	}

	render() {
		return(
			<Switch>
				<Route path="/LuaAPI">
					<LuaAPISidebar onFilterChange={this.handleFilterChange} actorClasses={this.props.actorClasses} namespaces={this.props.namespaces} enums={this.props.enums} singletons={this.props.singletons} />
				</Route>

				<GuidesSidebar />
			</Switch>
		)
	}
}

export default Sidebar;