import React, { Component } from "react";
import Highlight from 'react-highlight';
import { Link } from "react-router-dom";


class Sprite extends Component {
	render() {
		return (
			<div>
			<h1>Sprite</h1>

			<p><em>Sprite</em> actors can be used to load, display, and manipulate image and video data in StepMania 5.  If you want to load a png graphic and move it around, or animate a character from a sprite sheet, or play a video file, then the <em>Sprite</em> actor is what you&apos;re looking for.</p>

			<p>See the page on <Link to="Supported-File-Extensions">Supported File Extensions</Link> for a complete list of which filetypes are supported.</p>

			<p>As Lua tables, Sprite actors have one unique attribute that is worth knowing about, <code>Texture</code>.  Let&apos;s start with a very simple example of Sprite usage.</p>

			<span className="CodeExample-Title">A very simple Sprite example:</span>
			<Highlight className="lua">
{`
Def.Sprite{
	Name="Girlfriend",
	Texture="OverlayAttachedGirlfriend.png",
	InitCommand=function(self)
		self:zoom(0.5):Center()
	end
}
`}
			</Highlight>
			<p>This example will load a file titled <em>OverlayAttachedGirlfriend.png</em> in the same directory as the current Lua file, <code>Center()</code> it within its parent ActorFrame, and apply a 50% zoom (make it half as large).</p>

			<p>A common question that people new to StepMania scripting have is:</p>

			<p><strong>Where are those commands like</strong> <code>zoom()</code> <strong>and</strong> <code>Center()</code> <strong>coming from?</strong></p>

			<p>Keeping in mind that a <em>Sprite</em> is a specific type of StepMania <em>Actor</em>, we can look to StepMania&apos;s Lua API for a complete list of methods available first to all <a href="/Lua-For-SM5/API/Lua.xml#Actor">Actor</a> and then to <a href="/Lua-For-SM5/API/Lua.xml#Sprite">Sprite</a> specifically.  (Note that in your web-browser, you may need to click to expand the list of methods linked to.)</p>

			<h2>Animated Spritesheets</h2>

			<p>What about sprite sheets for animated sprites?  StepMania&apos;s engine is hardcoded to look for patterns in the filename with Sprite actors.  If you are loading a sprite sheet that you intend to animate through, you&apos;ll want to ensure that the filename of the png you are loading ends with the pattern: <em>(columns)</em>x<em>(rows)</em></p>

			<p>For example. this sprite of Dr. WIly has 6 columns across 1 row.</p>

			<p><img alt="a 6 by 1 spritesheet of Dr. Wily" src="./img/wily 6x1.png" /></p>

			<p>For StepMania to recognize it properly as a sprite sheet, you would want to append <strong>6x1</strong> to the end of the filename, resulting in something like <strong>Wily 6x1.png</strong>.</p>

			<p>When working with sprite sheets, <em>Sprite</em> actors can have infinitely many more attributes for each <code>Frame</code> and each Frame&apos;s <code>Delay</code> values, but there are better ways of doing handling those.  Let&apos;s look at an old example from <a href="https://www.youtube.com/watch?v=KhwxI60WeWU">The Ballad of Ian</a> from the D.O.W.N.S. 3 ITG tournament in January 2013.</p>

			<span className="CodeExample-Title">Old example from The Ballad of Ian.  Don&apos;t do this:</span>
			<Highlight className="lua">
{`
Def.Sprite {
	Texture="spin 13x1.png",
	Frame0000=0,
	Delay0000=0.0516,
	Frame0001=1,
	Delay0001=0.0516,
	Frame0002=2,
	Delay0002=0.0516,
	Frame0003=3,
	Delay0003=0.0516,
	Frame0004=4,
	Delay0004=0.0516,
	Frame0005=5,
	Delay0005=0.0516,
	Frame0006=6,
	Delay0006=0.0516,
	Frame0007=7,
	Delay0007=0.0516,
	Frame0008=8,
	Delay0008=0.0516,
	Frame0009=9,
	Delay0009=0.0516,
	Frame0010=10,
	Delay0010=0.0516,
	Frame0011=11,
	Delay0011=0.0516,
	Frame0012=12,
	Delay0012=0.0516,
	InitCommand=cmd( diffusealpha,0.5; zoom,0.6; vertalign,bottom; Center),
	OnCommand=cmd( sleep,8; linear,1; diffusealpha,0 ),
}
`}
			</Highlight>

			<p>While it is possible to specify frames and frame durations (delays) like this, you&apos;ll probably get the idea that this style is repetitive and prone to typos.  Here&apos;s a much more condensed version that accomplishes the same thing.</p>

			<span className="CodeExample-Title">A better way to manage sprite sheets:</span>
			<Highlight className="lua">
{`
Def.Sprite {
	Texture="spin 13x1.png",
	InitCommand=function(self)
		self:diffusealpha(0.5):zoom(0.6):vertalign(bottom):Center()
		self:SetAllStateDelays(0.0516)
	end,
	OnCommand=function(self)
		self:sleep(8):linear(1):diffusealpha(0)
	end
}
`}
			</Highlight>

			<p>Since the the time between each frame of animation is set globally using the <code>SetAllStateDelays()</code> method, the code is overall less prone to mistakes via typos.</p>

			<p>It is worth noting that in the above, animated examples, StepMania&apos;s engine will start with the first frame and progress to the last one in order.  There are times when we may want to only animate through a portion of a sprite sheet at any given moment, like with this character sprite sheet from a typical 16bit JRPG:</p>

			<p><img alt="a 4 by 4 spritesheet of SteveReen" src="./img/Reen 4x4.png" /></p>

			<p>If we want the <em>Sprite</em> actor to appear to be facing downward, then we&apos;d only want StepMania to be animating through the first row of the sprite sheet.  Here&apos;s a way to handle that.</p>

			<span className="CodeExample-Title">A complex Sprite example:</span>
			<Highlight className="lua">
{`
-- duration between frames, in seconds
local duration_between_frames = 0.15

-- We want SM5 to think of this as a single Sprite actor that sometimes
-- displays frames 0-3, and other times displays frames 8-11, so we're
-- going to need to manually specify each frame index like this.

-- The sequence of frames here corresponds with the physical layout of
-- the "guy 4x4.png" sprite sheet image shown above.

-- Yes, this "frames" table could be programmatically generated with
-- a nested loop but I'm explicitly writing it out here so it's
-- easier to see what it contains for this example.

local frames = {
	Down = {
		{ Frame=0,	Delay=duration_between_frames},
		{ Frame=1,	Delay=duration_between_frames},
		{ Frame=2,	Delay=duration_between_frames},
		{ Frame=3,	Delay=duration_between_frames}
	},
	Left = {
		{ Frame=4,	Delay=duration_between_frames},
		{ Frame=5,	Delay=duration_between_frames},
		{ Frame=6,	Delay=duration_between_frames},
		{ Frame=7,	Delay=duration_between_frames}
	},
	Right = {
		{ Frame=8,	Delay=duration_between_frames},
		{ Frame=9,	Delay=duration_between_frames},
		{ Frame=10,	Delay=duration_between_frames},
		{ Frame=11,	Delay=duration_between_frames}
	},
	Up = {
		{ Frame=12,	Delay=duration_between_frames},
		{ Frame=13,	Delay=duration_between_frames},
		{ Frame=14,	Delay=duration_between_frames},
		{ Frame=15,	Delay=duration_between_frames}
	}
}


local af = Def.ActorFrame{
	OnCommand=function(self) self:sleep(999):Center() end
}

af[#af+1] = Def.Sprite{
	Texture="Reen 4x4.png",

	InitCommand=function(self)
		-- when not actively tweening across the screen, the Sprite should
		-- not animate, so as to appear to be "standing" in place
		self:animate(false)

		-- align to left and v-middle
		self:halign(0):valign(0.5)
		self:Center()

		-- initialize the sprite state so that the sprite
		-- starts by facing downward
		self:SetStateProperties( frames.Down )
	end,

	-- In SM5, the StepMessage is broadcast whenever either player
	-- steps on a game button during gameplay.
	-- This doesn't handle buttons like START or SELECT.
	StepMessageCommand=function(self, params)

		-- As an arbitrary decision for the sake of this example
		-- let's only pay attention to steps from PLAYER_1
		if params.PlayerNumber == PLAYER_1 then

			-- turn animation back on for a brief moment
			self:animate(true)

			-- people can hit buttons faster than every 0.25 seconds, so it's
			-- possible to queue so many tweens that SM5 complains about a tween
			-- overflow. Mitigate this by canceling the previous linear tween, if
			-- one is still running, via the stoptweening() command.  Then
			-- apply a new linear tween to move the sprite one directional unit.
			self:stoptweening():linear(0.25)

			-- the "Column" param will match up with a Gameplay arrow column
			-- dance has 4 columns, pump has 5, etc.
			-- Column is 0-indexed because it's coming from C++.

			-- LEFT
			if params.Column == 0 then
				self:SetStateProperties( frames.Left )
				self:x(self:GetX() + (-1 * self:GetWidth()))

			-- DOWN
			elseif params.Column == 1 then
				self:SetStateProperties( frames.Down )
				self:y(self:GetY() + self:GetWidth())

			-- UP
			elseif params.Column == 2 then
				self:SetStateProperties( frames.Up )
				self:y(self:GetY() + (-1 * self:GetWidth()))

			-- RIGHT
			elseif params.Column == 3 then
				self:SetStateProperties( frames.Right )
				self:x(self:GetX() + self:GetWidth() )

			end

			-- The Sprite has tweened, so queue a command to stop the
			-- animation. We can't call animate(false) in here because
			-- it will terminate the call to animate(true) early and the
			-- sprite will never animate.
			self:queuecommand("StopAnimating")
		end
	end,
	StopAnimatingCommand=function(self)

		-- stop animating and set the sprite's frame to 0,
		-- regardless of direction the sprite is "facing".
		self:animate(false):setstate(0)
	end
}

return af
`}
			</Highlight>

			</div>
		);
	}
}

export default Sprite;