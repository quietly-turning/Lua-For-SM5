import React, { Component } from "react";
import Highlight from 'react-highlight';
import { Link } from "react-router-dom";

class ModChartSetup extends Component {
	render() {
		return (
		<div>
			<h1>Setting Up a "Mod" Chart</h1>

			<p>StepMania simfiles can be scripted to enhance gameplay using Lua and the SM5 API.  This chapter will briefly demonstrate how to prepare a simfile for such scripting.</p>

			<p className="alert alert-warning">This chapter is a work-in-progress!</p>

			<p>The FGCHANGES field in your .sm file accepts several arguments delimited by equals signs.  The first two are the most important:</p>
			<ul>
				<li>the beat in Gameplay at which you want the Lua file to be activated</li>
				<li>a path to the Lua file where you will be writing your code</li>
			</ul>

			<p>So, for exmaple, if you named your file <em>default.lua</em> and wanted it to trigger at beat 4, you would need to change your .sm (or .ssc) file to include:</p>

			<Highlight>#FGCHANGES: 4.000=./default.lua=1.000=0=0=1=====;</Highlight>

			<p>The other arguments (the <code>1.000</code> and subsequent <code>0</code>s and <code>1</code>s) are <a href="https://github.com/stepmania/stepmania/wiki/sm#bgchanges">various flags that are basically vestiges</a> from SM3.9 that are necessary to include but will have no impact on your Lua.  For FGCHANGES, you can just copy/paste them into your .sm file for each FGCHANGE.</p>

			<p>Any Lua-based actors loaded as FGCHANGES will be cleared from the screen as soon as they are "done." This means that if the actor isn&apos;t actively <Link to="/Simple-Tweens">tweening</Link> in some way, it will be cleared from memory.</p>

			<p>  A common strategy is to ensure that this doesn&apos;t occur prematurely is to add a dummy keep-alive Actor that does nothing but sleep for as long as you want the overall Lua file to persist for. That might look like:</p>

			<Highlight className="lua">
{`
-- a Lua file can only return one Actor
-- so the common strategy is to return one ActorFrame that contains many sub-Actors
return Def.ActorFrame{
	-- keep-alive Actor
	-- this will allow the file to persist for 999 seconds
	-- (or, until the end of the stepchart)
	Def.Actor{ OnCommand=function(self) self:sleep(999) end },

	-- the Sprite Actor
	Def.Sprite{
		Texture="awesome.png",
		OnCommand=function(self)
			self:Center():FullScreen():sleep(3):diffusealpha(0)
		end
	}
}
`}
			</Highlight>
			<p>In the exmaple above, the the Sprite has a <code>sleep(3)</code> tween, so it would appear on the screen for 3 seconds at beat 4 (specified by the .sm file) and then have an alpha of <code>0</code> applied, causing it to be effectively invisible.</p>

			<p>If you are testing this in SM5's editor, you'll need to ensure that you have <strong>Show Background Changes</strong> enabled, otherwise neither BGChanges nor FGChanges will appear.</p>

			<p>SM5&apos;s Lua error reporting interface is invaluable when scripting things like this. You can toggle it on/off by holding <kbd>F3</kbd> and tapping <kbd>F6</kbd> then tapping <kbd>8</kbd></p>

			<p>Finally, if there are no Lua errors, and you still can&apos;t get anything to appear, you may need to reload your simfiles.</p>
		</div>
		);
	}
}

export default ModChartSetup;