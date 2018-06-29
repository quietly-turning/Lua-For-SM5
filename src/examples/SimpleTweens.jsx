import React, { Component } from "react";
import Highlight from 'react-highlight';
import { Link } from "react-router-dom";

class SimpleTweens extends Component {
	render() {
		return (
			<div>

			<h1>Simple Tweens</h1>
			<h3 className="subtitle">Animate things from one state to another</h3>

			<p>A <em>tween</em> is a process in computer animation in which an object is manipulated (translated, transformed, altered, etc.) from a starting state to an ending state.  In the context of StepMania scripting, tweens are used to visually animate Actors.</p>

			<p>Using StepMania&apos;s Lua API, you can use tweens for many tasks, including (but not limited to):</p>

			<ul>
				<li>make a <Link to="/Def.Sprite">Sprite Actor</Link> grow to be twice as large by tweening <code>zoom(2)</code></li>
				<li>make the entire Screen Actor appear to &#8220;fade out&#8221; by tweening <code>diffuse(0,0,0,0)</code></li>
				<li>gradually make a <Link to="/Def.BitmapText">BitmapText Actor</Link> by tweening <code>diffusealpha(0)</code></li>
				<li>move a <Link to="/Def.Quad">Quad Actor</Link> diagonally 100 pixels down and 100 pixels right by tweening <code>xy(100,100)</code></li>
				<li>etc.</li>
			</ul>

			<p>This tutorial lists the types of simple tweens available through the <a href="/Lua-For-SM5/API/Lua.xml">Lua API</a>, discusses how to use tweens, and concludes with a full example.</p>

			<p>To learn more about Actors and Lua scripting in StepMania, check out the <Link to="/foreword">What Are Actors?</Link> tutorial.  To learn more about what Actor methods are available for tweening, refer to the <a href="/Lua-For-SM5/API/Lua.xml#Actor">Actor subsection</a> of the Lua API.
			</p>

			<h2>Tweens Defined by the Engine</h2>

			<p>The StepMania engine defines four simple tweens directly: <em>linear</em>, <em>accelerate</em>, <em>decelerate</em>, and <em>spring</em>.  </p>

			<ul>
				<li><code>linear()</code> - Execute following commands steadily, at a constant rate.</li>
				<li><code>accelerate()</code> - Starts slow and progressively speeds up.</li>
				<li><code>decelerate()</code> - Starts fast and progressively slows down.</li>
				<li><code>spring()</code> - Rapidly shoots beyond the desired end state, then springs back into place.</li>
			</ul>

			<p>For completion&apos;s sake, it is worth noting here that <code>sleep()</code> is also a tween, even though most Lua scripters working with StepMania don&apos;t think of it as such.  <code>sleep()</code> will wait for the specified duration, then execute all following commands at once.</p>

			<h2>Tweens Defined by the <em>_fallback</em> theme</h2>

			<p>The engine also defines a fifth tween type, <em>bezier</em>, which allows scripters to custom define more complex tweens.  Indeed, the <em>_fallback</em> theme uses the <code>bezier()</code> tween type to predefine a few extra tweens for us that are simple to use.</p>

			<ul>
				<li><code>smooth()</code> - Slow to start, fast in the middle, slow to finish.</li>
				<li><code>bouncebegin()</code> - Briefly inverts the tween at first, giving the appearance of bouncing to start.</li>
				<li><code>bounceend()</code> - Briefly inverts the tween at the end, giving the appearance of bouncing to end.</li>
				<li><code>drop()</code> - Slows as it approaches its end state, then briefly accelerates the final few frames.</li>
			</ul>

			<p>If you are interested in learning more about <code>bezier()</code> tweens, you can inspect <strong><a href="https://github.com/stepmania/stepmania/blob/master/Themes/_fallback/Scripts/02%20Actor.lua">02 Actor.lua</a></strong> in the _fallback theme&apos;s Scripts directory to see how <em>smooth</em>, <em>bouncebegin</em>, <em>bounceend</em>, and <em>drop</em> are defined in Lua.</p>

			<h2>How to Use Tweens</h2>

			<p>Knowing <em>what</em> we can use is great, but it&apos;s only half the picture.  If you apply a tween to an Actor without any further commands, it won&apos;t <em>do</em> anything.  Tweens need additional commands to execute over the course of their duration in order to animate in any meaningful way.</p>

			<p>Each of the tweens listed above takes a single argument: a <em>number</em> representing a duration in seconds for long the StepMania engine should tween the methods that immediately follow for.</p>

			<p>Let&apos;s illustrate what we mean by this with some examples.</p>

			<span className="CodeExample-Title">Tween a quad to become twice as large:</span>
			<Highlight className="lua">
{`
Def.Quad{
	OnCommand=function(self)
		-- draw a Quad in center of the screen, make it 100x100 pixels,
		-- and make it red
		self:Center():zoomto(100,100):diffuse(1,0,0,1)

		-- over a duration of 3 seconds, have the
		-- quad zoom to be twice its initial size
		self:linear(3):zoom(2)
	end
}
`}
			</Highlight>


			<p>The next example is somewhat more fun in that it appears to spin the entire screen around, but it also illustrates a &#8220;gotcha&#8221; with tweening that you should be aware of.</p>

			<span className="CodeExample-Title">Rotate the entire Screen on the z-axis:</span>
			<Highlight className="lua">
{`
Def.ActorFrame{
	OnCommand=function(self)
		-- get the current Screen object using SCREENMAN
		local screen = SCREENMAN:GetTopScreen()

		-- over a duration of 2 seconds, have
		-- the entire screen rotate 360 degrees
		-- clockwise on the z-axis
		screen:accelerate(2):rotationz(360)

		-- wait one second
		screen:sleep(1)

		-- This should spin the screen around again, right?
		-- Not quite. The screen's z-rotation is already set
		-- to 360, so this will have no visible effect.
		screen:accelerate(2):rotationz(360)

		-- This, however, will because it adds more rotation
		-- to the current state, rather than the initial state.
		screen:accelerate(2):addrotationz(360)
	end
}
`}
			</Highlight>

			<p>Can you tween more than one property of an actor at once?  Absolutely.</p>

			<p>The next example demonstrates that it is possible to tween multiple methods with a single tween.  After calling a tween method, all methods following it will be tweened until the next tween method is encountered.</p>

			<span className="CodeExample-Title">Move a quad across the screen while fading it out:</span>
			<Highlight className="lua">
{`
Def.Quad{
	OnCommand=function(self)
		-- draw a Quad at the top-left of the screen, which is the
		-- default draw position if no x or y coordinates are specified,
		-- and make it 100x100 pixels
		self:zoomto(100,100)

		-- over a duration of 2 seconds, have the
		-- quad move to the bottom-right of the screen,
		-- and fade out by tweening the alpha channel to 0
		-- This comprises one full tween.
		self:decelerate(2):xy( _screen.w, _screen.h ):diffusealpha(0)

		-- Here is a second, unique tween that tweens three methods
		-- to change the color, xy-position, and y-rotation of the Quad.
		-- Note that line breaks are fine.
		self:accelerate(3)
			:diffuse(1,0,0,1)
			:xy( _screen.cx, _screen.cy )
			:addrotationy(1080)

	end
}
`}
			</Highlight>

			<h2>Tweens in Motion</h2>

			<p>Reading about tweens good, but a visual is worth a thousand words.  Here is a scripted simfile you can run in StepMania 5 that briefly demonstrates each of these tweens, one after another.</p>

			<p>You can download that here!  <a href="/Lua-For-SM5/downloads/Simple-Tweens.zip">Simple-Tweens.zip</a></p>

			</div>
		);
	}
}

export default SimpleTweens;