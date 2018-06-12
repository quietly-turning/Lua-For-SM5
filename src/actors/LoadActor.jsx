import React, { Component } from "react";
import Highlight from 'react-highlight';
import { Link } from "react-router-dom";


class LoadActor extends Component {
	render() {
		return (
			<div>

			<h1>LoadActor()</h1>

			<p><em>LoadActor()</em> is a helper function with some extremely useful properties that make it a staple of any SM5 Lua scripting endeavor.</p>

			<h3>First Argument - A file path to Load</h3>

			<p>The function itself requires at least one argument, a string value of the file to load.  Let&apos;s consider a simple example, the code from <Link to="/Sprite">the page on Def.Sprite</Link>, now rewritten to use <code>LoadActor()</code>:</p>

			<span className="CodeExample-Title">A very simple LoadActor example:</span>
			<Highlight className="lua">
{`
-- pass the function a path to an image file
-- and append a table with the relevant commands
LoadActor( "OverlayAttachedGirlfriend.png" )..{
	Name="Girlfriend",
	InitCommand=function(self)
		self:zoom(0.5):Center()
	end
}
`}
			</Highlight>

			<p>As <a href="https://github.com/stepmania/stepmania/blob/a888506b3270d6c66d12cb2165fb8d4b1a7d978f/Themes/_fallback/Scripts/02%20ActorDef.lua#L95-L159">its definition in the _fallback theme demonstrates </a>, <em>LoadActor()</em> can load Lua files, image/video files, sound files, models, and directories.  In this manner, it can effectively take the place of knowing when to use <code>Def.Sprite{}</code>, <code>Def.Sound{}</code>, <code>Def.Model{}</code> or <code>Def.Actor</code>.</p>

			<h3>Second Argument - A table to pass into the loaded file</h3>

			<p>The optional second argument of LoadActor() is where it really shines, however.  Let&apos;s look at this slightly more complex example which uses two Lua files.</p>

			<p><strong>Primary.lua</strong> will load <strong>Box.lua</strong> once for each available human player and pass in unique properties to each.  If only PLAYER<em>1 is available, only the red quadrilateral on the left will be drawn.  If only PLAYER</em>2 is available, only the blue quadrilateral on the right will be drawn.</p>

			<p><img alt="" className="img-fluid" src="/Lua-For-SM5/img/loadactor.png" /></p>

			<p>This sort of setup allows us to keep generic code definitions in files like Box.lua, and load them as needed from the primary file with specific values passed in.</p>

			<span className="CodeExample-Title">Primary.lua</span>
			<Highlight className="lua">
{`
local af = Def.ActorFrame{
	InitCommand=function(self) self:Center():sleep(9999) end
}

local box_values ={
	P1 = {
		color = Color.Red,
		x = _screen.cx-200,
		y = _screen.cy,
		h = 100,
		w = 50
	},
	P2 = {
		color = Color.Blue,
		x = _screen.cx+200,
		y = _screen.cy,
		h = 50,
		w = 175
	}
}


-- Loop through any available human players
-- (as opposed to "joined" players, which can be misleading)
-- and load a Box.lua to the ActorFrame for each.
for player in ivalues( GAMESTATE:GetHumanPlayers() ) do

	-- Tranform a player enum string value into the part after
	-- the underscore with the ToEnumShortString() helper function.

	-- In this case "PlayerNumber_P1" becomes "P1"
	-- and "PlayerNumber_P2" becomes "P2"
	local pn = ToEnumShortString(player)

	-- The contents of Box.lua return a Quad.  Keep reading!
	-- Pass the specific box values we want into the file.
	af[#af+1] = LoadActor( "./Box.lua", box_values[ pn ] )
end

return af
`}
			</Highlight>

			<span className="CodeExample-Title">Box.lua</span>
			<Highlight className="lua">
{`
-- The box_values for this player from the primary lua file
-- are brought into this file via the "..." syntax.
local this_box = ...

return Def.Quad{
	InitCommand=function(self)
		self:xy( this_box.x, this_box.y )
		self:diffuse( this_box.color )
		self:setsize( this_box.w, this_box.h  )
	end
}
`}
			</Highlight>


			</div>
		);
	}
}

export default LoadActor;