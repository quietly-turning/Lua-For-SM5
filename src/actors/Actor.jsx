import React, { Component } from "react";
import Highlight from 'react-highlight';
import { Link } from "react-router-dom";


class Actor extends Component {
	render() {
		return (
			<div>
			<h1>Actor</h1>
			<p>The <strong>Actor</strong> class is the most generic and lightweight StepMania Actor; all other Actors inherit from it (directly or eventually). Using an Actor object directly is not generally helpful; it can&apos;t <em>do</em> very much.   The <code>LoadActor()</code> helper function <Link to="LoadActor">discussed later</Link> is far more flexible and useful!</p>

			<p>Still, there are times when <strong>Actor</strong> objects can be useful.  For example, the Simply Love SM5 port uses them when we need a hook into some message broadcast by the engine but don&apos;t need an entire ActorFrame.</p>

			<p>In theming example below, we are using an <code>Actor</code> to listen for the <code>StartTransitioningCommand</code> to be broadcast by the engine when a screen is transitioning out (and preparing to initialize the next screen).  When that occurs, we make a call to save the theme&apos;s preferences, assuming the theme is already using the <a href="https://github.com/stepmania/stepmania/blob/5_1-new/Themes/_fallback/Scripts/02%20ThemePrefs.lua">ThemePrefs system</a>.</p>

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

			<p>For another example, see: <a href="https://github.com/dguzek/Simply-Love-SM5/blob/00fdf7112b0050d229679c39d777dfca5f0bb11a/BGAnimations/ScreenGameplay%20overlay/ReceptorArrowsPosition.lua#L25-L40">./Simply Love/BGAnimations/ScreenGameplay overlay/ReceptorArrowsPosition.lua</a></p>

			</div>
		);
	}
}

export default Actor;