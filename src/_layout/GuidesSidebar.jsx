import React, { Component } from "react"
import { NavLink } from "react-router-dom"
import $ from "jquery"

class GuidesSidebar extends Component {

	componentDidMount(){
		[1,2,3,4,5].forEach(function(i){
			const el = $("#collapse-" + i)
			const listitem_anchors = el.find('li a')

			listitem_anchors.each(function(j, anchor){
				if ($(anchor).hasClass("active")){
					// ensure the proper sidebar section is not collaposed
					el.addClass("show")
					// ensure the proper styling rules are applied to active section header
					$("#heading-" + i).removeClass("collapsed")
				}
			})
		});
	}

	render() {
		return (
			<nav id="GuidesSidebar">
				<section>
					<h5 id="heading-1" className="collapsed" data-toggle="collapse" data-target="#collapse-1" aria-expanded="false" aria-controls="collapse-1">
						Introduction
					</h5>

					<div id="collapse-1" className="collapse no-transition" aria-labelledby="heading-1">
						<ul>
							<li><NavLink to="/foreword">What Are Actors?</NavLink></li>
							<li><NavLink to="/lua">Lua changes from SM3.95</NavLink></li>
							<li><NavLink to="/Supported-File-Extensions">Supported File Extensions</NavLink></li>
							<li><NavLink to="/Mod-Chart-Setup">Setting Up a "Mod" Chart</NavLink></li>
						</ul>
					</div>
				</section>


				<section>
					<h5 id="heading-2" className="collapsed" data-toggle="collapse" data-target="#collapse-2" aria-expanded="false" aria-controls="collapse-2">
						Actors
					</h5>
					<div id="collapse-2" className="collapse no-transition" aria-labelledby="heading-2">
						<ul>
							<li><NavLink to="/Def.Quad">Quad</NavLink></li>
							<li><NavLink to="/Def.BitmapText">BitmapText</NavLink></li>
							<li><NavLink to="/Def.Sprite">Sprite</NavLink></li>
							<li><NavLink to="/Def.Actor">Actor</NavLink></li>
							<li><NavLink to="/LoadActor">LoadActor()</NavLink></li>
							<li><NavLink to="/Def.Sound">Sound</NavLink></li>
							<li><NavLink to="/Def.Model">Model</NavLink></li>
							<li><NavLink to="/Def.ActorMultiVertex">ActorMultiVertex</NavLink></li>
							<li><NavLink to="/Def.ActorFrameTexture">ActorFrameTexture</NavLink></li>
						</ul>
					</div>
				</section>


				<section>
					<h5 id="heading-3" className="collapsed" data-toggle="collapse" data-target="#collapse-3" aria-expanded="false" aria-controls="collapse-3">
						Singletons
					</h5>
					<div id="collapse-3" className="collapse no-transition" aria-labelledby="heading-3">
						<ul>
							<li><NavLink to="/SCREENMAN">SCREENMAN</NavLink></li>
							<li><NavLink to="/SOUND">SOUND</NavLink></li>
						</ul>
					</div>
				</section>


				<section>
					<h5 id="heading-4" className="collapsed" data-toggle="collapse" data-target="#collapse-4" aria-expanded="false" aria-controls="collapse-4">
						Best Practices
					</h5>
					<div id="collapse-4" className="collapse no-transition" aria-labelledby="heading-4">
						<ul>
							<li><NavLink to="/Debugging">Debugging</NavLink></li>
							<li><NavLink to="/Command-Chaining">Command Chaining</NavLink></li>
						</ul>
					</div>
				</section>


				<section>
					<h5 id="heading-5" className="collapsed" data-toggle="collapse" data-target="#collapse-5" aria-expanded="false" aria-controls="collapse-5">
						Examples
					</h5>
					<div id="collapse-5" className="collapse no-transition" aria-labelledby="heading-5">
						<ul>
							<li><NavLink to="/Arbitrary-Input">Handling Arbitrary Input</NavLink></li>
							<li><NavLink to="/Simple-Tweens">Simple Tweens</NavLink></li>
						</ul>
					</div>
				</section>
			</nav>
		)
	}
}

export default GuidesSidebar