import React, { Component } from "react"
import { Route, Routes }    from "react-router-dom"
import GuidesSidebar from "./GuidesSidebar"
import LuaAPISidebar from "./LuaAPISidebar"

class Sidebar extends Component {

	render() {
		return(
			<Routes>
				<Route path="/"             element={<GuidesSidebar />} />
				<Route path="/Resources"    element={<GuidesSidebar />} />
				<Route path="/:group/:page" element={<GuidesSidebar />} />

				<Route
					path="/LuaAPI"
					element={
						<LuaAPISidebar
							setSelectedAPI={this.props.setSelectedAPI}
							actors={this.props.actors}
							screens={this.props.screens}
							smClasses={this.props.smClasses}
							namespaces={this.props.namespaces}
							enums={this.props.enums}
							singletons={this.props.singletons}
							supportedAPIs={this.props.supportedAPIs}
							isAPILoaded={this.props.isAPILoaded}
						/>
					}
				/>
			</Routes>
		)
	}
}

export default Sidebar;