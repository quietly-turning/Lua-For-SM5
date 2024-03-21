import React, { Component } from "react";
import { NavLink } from "react-router-dom";


class Header extends Component {
	constructor(props){
		super(props)
		this.darkMode = false

		this.toggleColorMode       = this.toggleColorMode.bind(this);
		this.handleMobileNavToggle = this.handleMobileNavToggle.bind(this)
		this.hideMobileNav         = this.hideMobileNav.bind(this)
		this.showMobileNav         = this.showMobileNav.bind(this)

		this.state = {
			mobile_nav: false,
		}
	}

	// once this Header component loads, retrieve 'bsTheme' from localStorage
	// and use the value to set darkMode
	componentDidMount() {
		this.darkMode = localStorage.getItem('bsTheme') === 'dark'
		this.toggleColorMode({target:{checked:this.darkMode}})
	}

	handleMobileNavToggle(){
		this.state.mobile_nav ?	this.hideMobileNav() : this.showMobileNav()
	}

	showMobileNav(){
		this.setState({mobile_nav: true})
		// const bottomNavbarClasses = document.getElementById('mobileNav')?.classList
		const topNavbarClasses    = document.getElementById('navbarNav')?.classList
		// bottomNavbarClasses.add('show')
		topNavbarClasses.add('show')
	}

	hideMobileNav(){
		this.setState({mobile_nav: false})
		const bottomNavbarClasses = document.getElementById('mobileNav')?.classList
		const topNavbarClasses    = document.getElementById('navbarNav')?.classList
		bottomNavbarClasses.remove('show')
		topNavbarClasses.remove('show')
	}


	toggleColorMode(e){
		this.darkMode = e.target.checked

		// topbar has 2 checkboxes for toggling light/dark (one for mobile, one for full width)
		// ensure they stay synced when either is clicked
		for (const checkbox of document.getElementsByClassName('lightswitch')){
			checkbox.checked = e.target.checked
		}

		const bsTheme = this.darkMode ? 'dark' : 'light'
		document.documentElement.dataset.bsTheme = bsTheme
		localStorage.setItem('bsTheme', bsTheme);
	}

	render() {
		return (
			<nav id="topbar" className="navbar navbar-expand-sm navbar-dark fixed-top">

				<div className="navbar-nav">
					<NavLink className="ms-4 me-4 nav-link text-nowrap text-white font-weight-normal" exact="true" to="/">
						<img src="/Lua-For-SM5/img/stepmania.png" className="me-2" alt="" width="25" height="25" />
						Lua for SM5
					</NavLink>
				</div>

				<div className="navbar-right">
					<button className="navbar-toggler me-4" type="button" data-bs-toggle="collapse" onClick={this.handleMobileNavToggle} aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
						<span className="navbar-toggler-icon"></span>
					</button>

					<div className="colorMode-toggle form-check form-switch me-3 mobile-only">
						<label className="form-check-label ms-1" htmlFor="lightSwitchMobile">
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-brightness-high" viewBox="0 0 16 16">
								<path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"></path>
								<path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z"></path>
							</svg>
						</label>

						<input className="form-check-input lightswitch" type="checkbox" id="lightSwitchMobile" onChange={this.toggleColorMode} />
					</div>
				</div>

				<div className="collapse navbar-collapse" id="navbarNav">
						<ul className="navbar-nav">
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

					<div className="colorMode-toggle form-check form-switch me-3 fullwidth-only">
						<label className="form-check-label ms-1" htmlFor="lightSwitchFullWidth">
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-brightness-high" viewBox="0 0 16 16">
								<path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"></path>
								<path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z"></path>
							</svg>
						</label>

						<input className="form-check-input lightswitch" type="checkbox" id="lightSwitchFullWidth" onChange={this.toggleColorMode} />
					</div>
			</nav>
		);
	}
}

export default Header