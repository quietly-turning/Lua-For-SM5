import React, { Component } from "react";
import Highlight from 'react-highlight';
import { Link } from "react-router-dom";


class Actor extends Component {
	render() {
		return (
			<div>
			<h1>Actor</h1>
			<p>The <strong>Actor</strong> class is the most generic and lightweight StepMania Actor; all other Actors inherit from it (directly or eventually).  Using <strong>Actor</strong> objects directly to load an image or sound can be somewhat cumbersome; the <code>LoadActor()</code> helper function <Link to="LoadActor">discussed later</Link> is often easier to use and more flexible.</p>

			<p>Still, there are times when <strong>Actor</strong> objects can be useful.  For example, the Simply Love SM5 port uses them when we need a hook to some message broadcast by the engine but an ActorFrame isn&apos;t necessary.</p>

			<p>See: <a href="Simply Love/BGAnimations/ScreenOptionsService in.lua">https://github.com/dguzek/Simply-Love-SM5/blob/master/BGAnimations/ScreenOptionsService%20in.lua</a></p>

			<span className="CodeExample-Title">Example using an Actor directly:</span>

			<Highlight className="lua">
{`
return Def.Actor{
	StartTransitioningCommand=function(self)
		ThemePrefs.Save()
	end
}
`}
			</Highlight>
			</div>
		);
	}
}

export default Actor;