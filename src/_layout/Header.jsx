import React, { Component } from "react";
import { NavLink } from "react-router-dom";


class Header extends Component {
	render() {
		return (
			<nav id="topbar" className="navbar navbar-expand-sm navbar-dark fixed-top">

				<div className="navbar-nav">
					<NavLink className="ml-4 mr-5 nav-link text-nowrap text-white font-weight-normal" exact to="/">
						<img src="/Lua-For-SM5/img/stepmania.png" className="mr-2" alt="" width="25" height="25" />
						Lua for SM5
					</NavLink>
				</div>


				<button className="navbar-toggler mr-4" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>

		 		<div className="collapse navbar-collapse" id="navbarNav">
					<ul className="navbar-nav pl-4">
						<li className="nav-item">
							<NavLink className="nav-link" exact to="/">Guides</NavLink>
						</li>
						<li className="nav-item">
							<NavLink className="nav-link" to="/LuaAPI">Lua API</NavLink>
						</li>
						<li className="nav-item">
							<NavLink className="nav-link" to="/Resources">Other Resources</NavLink>
						</li>
					</ul>
 				</div>
			</nav>
		);
	}
}

export default Header