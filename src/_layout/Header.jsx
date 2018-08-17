import React, { Component } from "react";
import { NavLink } from "react-router-dom";


class Header extends Component {
  render() {
    return (
			<nav id="topbar" className="navbar navbar-expand-sm navbar-dark bg-dark fixed-top">

				<img src="/Lua-For-SM5/img/stepmania.png" className="navbar-brand" alt="" width="25" />
		 		<span className="navbar-brand">
		 			Lua for SM5
				</span>

				<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>

		 		<div className="collapse navbar-collapse" id="navbarNav">
					<ul className="navbar-nav">
						<li className="nav-item">
							<NavLink className="nav-link" exact to="/">Home</NavLink>
						</li>
						<li className="nav-item">
							<NavLink className="nav-link" to="/LuaAPI">API</NavLink>
						</li>
						<li className="nav-item">
							<NavLink className="nav-link" to="/resources">Other Resources</NavLink>
						</li>
					</ul>
 				</div>
			</nav>
		);
	}
}

export default Header