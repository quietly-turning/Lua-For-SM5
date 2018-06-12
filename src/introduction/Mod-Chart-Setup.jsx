import React, { Component } from "react";
import Highlight from 'react-highlight';

class ModChartSetup extends Component {
	render() {
		return (
		<div>
			<h1>Setting Up a "Mod Chart"</h1>

			<p>StepMania simfiles can be scripted to enhance gameplay using Lua and the SM5 API.  This chapter will briefly demonstrate how to prepare a simfile for such scripting.</p>

			<p className="alert alert-warning">This chapter is a work-in-progress!</p>

			<p>The FGCHANGES field in your .sm file should match the name of the Lua file where you will be writing your code.  For exmaple, if you named your file <em>default.lua</em>, you would need to change your .sm file to include:</p>

			<Highlight>#FGCHANGES: 1.000=./default.lua=1.000=0=0=1=====;</Highlight>

			<p>Any Lua-based actors loaded as FGChanges will be cleared from the screen as soon as they are "done." This means that if the actor isn&apos;t actively tweening in some way, it will be cleared from memory.</p>

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
			<p>In the exmaple above, the the Sprite has a <code>sleep(3)</code> tween, so it would appear on the screen for 3 seconds at beat 1 (specified by the .sm file) and then disappear.</p>

			<p>If you are testing this in SM5's editor, you'll need to ensure that you have <strong>Show Background Changes</strong> enabled, otherwise neither BGChanges nor FGChanges will appear.</p>

			<p>SM5&apos;s Lua error reporting interface is invaluable when scripting thing like this. You can toggle it on/off by holding <kbd>F3</kbd> and tapping <kbd>F6</kbd> then tapping <kbd>8</kbd></p>

			<p>Finally, if there are no Lua errors, and still can&apos;t get anything to appear, you may need to reload your simfiles.</p>
		</div>
		);
	}
}

export default ModChartSetup;