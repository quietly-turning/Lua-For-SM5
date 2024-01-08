import React, { Component } from "react";
import { NavLink } from "react-router-dom";


class Header extends Component {
	constructor(props){
		super(props)
		this.darkMode = false
		this.toggleColorMode  = this.toggleColorMode.bind(this);
	}

	toggleColorMode(e){
		this.darkMode = e.target.checked
		document.documentElement.dataset.bsTheme = this.darkMode ? 'dark' : 'light'
	}

	render() {
		return (
			<nav id="topbar" className="navbar navbar-expand-sm navbar-dark fixed-top">

				<div className="navbar-nav">
					<NavLink className="ms-4 me-5 nav-link text-nowrap text-white font-weight-normal" exact="true" to="/">
						<img src="/Lua-For-SM5/img/stepmania.png" className="me-2" alt="" width="25" height="25" />
						Lua for SM5
					</NavLink>
				</div>


				<button className="navbar-toggler me-4" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
					<span className="navbar-toggler-icon"></span>
				</button>

		 		<div className="collapse navbar-collapse" id="navbarNav">
					<ul className="navbar-nav ps-4">
						<li className="nav-item">
							<NavLink className="nav-link" exact="true" to="/">Guides</NavLink>
						</li>
						<li className="nav-item">
							<NavLink className="nav-link" to="/LuaAPI">Lua API</NavLink>
						</li>
						<li className="nav-item">
							<NavLink className="nav-link" to="/Resources">Other Resources</NavLink>
						</li>
					</ul>
 				</div>

				 <div className="colorMode-toggle form-check form-switch ms-auto me-3">
					<label className="form-check-label ms-1" htmlFor="lightSwitch">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-brightness-high" viewBox="0 0 16 16">
							<path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"></path>
							<path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z"></path>
						</svg>
					</label>

					<input className="form-check-input" type="checkbox" id="lightSwitch" onChange={this.toggleColorMode} />
				</div>
			</nav>
		);
	}
}

export default Header