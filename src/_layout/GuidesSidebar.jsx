import React, { Component } from "react"
import { NavLink } from "react-router"
import * as bootstrap from "bootstrap"
import $ from "jquery"

class GuidesSidebar extends Component {
	constructor(props){
		super(props)
	}

	componentDidMount(){
		// ensure all GuideSidebar menus (mobile and fullwidth) are collapsed after page load
		[1,2,3,4,5].forEach(function(i){
			// full width collapsible menus
			const el = $(`#collapse-${i}`)
			const listitem_anchors = el.find('li a')
			// mobile collapsible menus
			const mobileEl = $(`#mobile-collapse-${i}`)
			listitem_anchors.push(mobileEl.find('li a'))

			listitem_anchors.each(function(j, anchor){
				if ($(anchor).hasClass("active")){
					// ensure the proper sidebar section is not collaposed
					el.addClass("show")
					// ensure the proper styling rules are applied to active section header
					$(`#heading-${i}`).removeClass("collapsed")
				}
			})
		})
	}

	handleClick(index){
		const el = document.getElementById(`#${this.props.mobile ? 'mobile-' : ''}collapse-${index}`)
		let bsCollapse = bootstrap.Collapse.getInstance(el)
		if (bsCollapse === null) { bsCollapse = new bootstrap.Collapse(`#${this.props.mobile ? 'mobile-' : ''}collapse-${index}`, {toggle: false }) }
		bsCollapse.toggle()

		const headingEl = document.getElementById(`${this.props.mobile ? 'mobile-' : ''}heading-${index}`)
		if (headingEl){ headingEl.classList.toggle('collapsed')}
	}

	handleKeyPress(event, index){
		if (event.key==='Enter' || event.key==='ArrowLeft' || event.key==='ArrowRight'){
			const el = document.getElementById(`#${this.props.mobile ? 'mobile-' : ''}collapse-${index}`)
			let bsCollapse = bootstrap.Collapse.getInstance(el)
			if (bsCollapse === null) { bsCollapse = new bootstrap.Collapse(`#${this.props.mobile ? 'mobile-' : ''}collapse-${index}`, {toggle: false }) }
			const headingEl = document.getElementById(`#${this.props.mobile ? 'mobile-' : ''}heading-${index}`)

			if (event.key==='Enter'){
				bsCollapse.toggle()
				if (headingEl){ headingEl.classList.toggle('collapsed')}

			} else if (event.key==='ArrowLeft'){
				bsCollapse.hide()
				if (headingEl){ headingEl.classList.add('collapsed')}

			} else if (event.key==='ArrowRight'){
				bsCollapse.show()
				if (headingEl){ headingEl.classList.remove('collapsed')}

			}
		}
	}

	render() {
		return (
			<nav tabIndex="-1" className="GuidesSidebar">
				<section>
					<h5
						className="collapsed expandable" id={(this.props.mobile ? "mobile-" : "") + "heading-1"}
						onKeyDown={(e) => this.handleKeyPress(e, 1) }
						onClick={() => this.handleClick(1)}
						aria-expanded="false" aria-controls={(this.props.mobile ? "mobile-" : "") + "collapse-1"}
					>
						<span tabIndex="0">
							Introduction
						</span>
					</h5>

					<div id={(this.props.mobile ? "mobile-" : "") + "collapse-1"}
						className="collapse no-transition"
						aria-labelledby={(this.props.mobile ? "mobile-" : "") + "aria-labelledby-1"}
					>
						<ul>
							<li><NavLink to="/Introduction/Foreword">What Are Actors?</NavLink></li>
							<li><NavLink to="/Introduction/Lua">Lua changes from SM3.95</NavLink></li>
							<li><NavLink to="/Introduction/Supported-File-Extensions">Supported File Extensions</NavLink></li>
							<li><NavLink to="/Introduction/Mod-Chart-Setup">Setting Up a "Mod" Chart</NavLink></li>
						</ul>
					</div>
				</section>


				<section>
					<h5
						className="collapsed expandable" id={(this.props.mobile ? "mobile-" : "") + "heading-2"}
						onKeyDown={(e) => this.handleKeyPress(e, 2) }
						onClick={() => this.handleClick(2)}
						aria-expanded="false" aria-controls={(this.props.mobile ? "mobile-" : "") + "collapse-2"}
					>
						<span tabIndex="0">
							Actors
						</span>
					</h5>
					<div id={(this.props.mobile ? "mobile-" : "") + "collapse-2"}
						className="collapse no-transition"
						aria-labelledby={(this.props.mobile ? "mobile-" : "") + "aria-labelledby-2"}
					>
						<ul>
							<li><NavLink to="/Actors/Quad">Quad</NavLink></li>
							<li><NavLink to="/Actors/BitmapText">BitmapText</NavLink></li>
							<li><NavLink to="/Actors/Sprite">Sprite</NavLink></li>
							<li><NavLink to="/Actors/Actor">Actor</NavLink></li>
							<li><NavLink to="/Actors/LoadActor">LoadActor()</NavLink></li>
							<li><NavLink to="/Actors/Sound">Sound</NavLink></li>
							<li><NavLink to="/Actors/Model">Model</NavLink></li>
							<li><NavLink to="/Actors/ActorMultiVertex">ActorMultiVertex</NavLink></li>
							<li><NavLink to="/Actors/ActorFrameTexture">ActorFrameTexture</NavLink></li>
						</ul>
					</div>
				</section>


				<section>
					<h5
						className="collapsed expandable" id={(this.props.mobile ? "mobile-" : "") + "heading-3"}
						onKeyDown={(e) => this.handleKeyPress(e, 3) }
						onClick={() => this.handleClick(3)}
						aria-expanded="false" aria-controls={(this.props.mobile ? "mobile-" : "") + "collapse-3"}
					>
						<span tabIndex="0">
							Singletons
						</span>
					</h5>
					<div id={(this.props.mobile ? "mobile-" : "") + "collapse-3"}
						className="collapse no-transition"
						aria-labelledby={(this.props.mobile ? "mobile-" : "") + "aria-labelledby-3"}
					>
						<ul>
							<li><NavLink to="/Singletons/SCREENMAN">SCREENMAN</NavLink></li>
							<li><NavLink to="/Singletons/SOUND">SOUND</NavLink></li>
						</ul>
					</div>
				</section>


				<section>
					<h5
						className="collapsed expandable" id={(this.props.mobile ? "mobile-" : "") + "heading-4"}
						onKeyDown={(e) => this.handleKeyPress(e, 4) }
						onClick={() => this.handleClick(4)}
						aria-expanded="false" aria-controls={(this.props.mobile ? "mobile-" : "") + "collapse-4"}
					>
						<span tabIndex="0">
							Best Practices
						</span>
					</h5>
					<div id={(this.props.mobile ? "mobile-" : "") + "collapse-4"}
						className="collapse no-transition"
						aria-labelledby={(this.props.mobile ? "mobile-" : "") + "aria-labelledby-4"}
					>
						<ul>
							<li><NavLink to="/Best-Practices/Debugging">Debugging</NavLink></li>
							<li><NavLink to="/Best-Practices/Command-Chaining">Command Chaining</NavLink></li>
						</ul>
					</div>
				</section>


				<section>
					<h5
						className="collapsed expandable" id={(this.props.mobile ? "mobile-" : "") + "heading-5"}
						aria-expanded="false" aria-controls={(this.props.mobile ? "mobile-" : "") + "collapse-5"}
						onKeyDown={(e) => this.handleKeyPress(e, 5) }
						onClick={() => this.handleClick(5)}
					>
						<span tabIndex="0">
							Theming
						</span>
					</h5>
					<div id={(this.props.mobile ? "mobile-" : "") + "collapse-5"}
						className="collapse no-transition"
						aria-labelledby={(this.props.mobile ? "mobile-" : "") + "aria-labelledby-5"}
					>
						<ul>
							<li><NavLink to="/Theming/Hacking-on-an-Existing-Theme">Hacking on an Existing Theme</NavLink></li>
							<li><NavLink to="/Theming/Keyboard-Commands">Keyboard Commands</NavLink></li>
							<li><NavLink to="/Theming/Arbitrary-Input">Handling Arbitrary Input</NavLink></li>
							<li><NavLink to="/Theming/Simple-Tweens">Simple Tweens</NavLink></li>
						</ul>
					</div>
				</section>
			</nav>
		)
	}
}

export default GuidesSidebar
