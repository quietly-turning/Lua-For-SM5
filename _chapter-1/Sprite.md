---
layout: default
title: Sprite
chapter: 1
section: 3
---


# Section 1.3 &mdash; Sprite

*Sprite* actors can be used to load, display, and manipulate image and video data in StepMania 5.  If want to load a png graphic and move it around, or animate a character from a sprite sheet, or play a video file, then the *Sprite* actor is what you're looking for.


See the page on [Supported File Extensions]({{site.baseurl}}/chapter-1/Supported-File-Extensions.html) for a complete list of which filetypes are supported.


As Lua tables, Sprite actors have one unique attributes that is worth knowing about, `Texture`.  Let's start with a very simple example of Sprite usage.

<span class="CodeExample-Title">A very simple Sprite example:</span>
{% highlight lua linenos=table %}
Def.Sprite{
	Name="OverlayAttachedGirlfriend.png",
	InitCommand=function(self)
		self:zoom(0.5):Center()
	end
}
{% endhighlight %}

This example will load a file titled *OverlayAttachedGirlfriend.png* in the same directory as the current Lua file, `Center()` it within its parent ActorFrame, and apply a 50% zoom (make it half as large).

What about sprite sheets for animated sprites?  StepMania's engine is hardcoded to look for patterns in the filename with Sprite actors.  If you are loading a sprite sheet that you intend to animate through, you'll want to ensure that the filename of the png you are loading ends with the pattern: *(columns)*x*(rows)*

For example. this sprite of Dr. WIly has 6 columns across 1 row.

<img src="{{ site.baseurl }}/images/wily 6x1.png">

For StepMania to recognize it properly as a sprite sheet, you would want to append **6x1** to the end of the filename, resulting in something like **Wily 6x1.png**.

When working with sprite sheets, *Sprite* actors can have infinitely many more attributes for each `Frame` and each Frame's `Delay` values, but there are better ways of doing handling those.  Let's look at an old example from [The Ballad of Ian](https://www.youtube.com/watch?v=KhwxI60WeWU) from the D.O.W.N.S. 3 ITG tournament in January 2013.

<span class="CodeExample-Title">Old example from The Ballad of Ian.  Don't do this:</span>
{% highlight lua linenos=table %}
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
{% endhighlight %}

While it is possible to specify frames and frame durations (delays) like this, you'll probably get the idea that this style is repetitive and prone to typos.  Here's a much more condensed version that accomplishes the same thing.

<span class="CodeExample-Title">A better way to manage sprite sheets:</span>
{% highlight lua linenos=table %}
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
{% endhighlight %}

Since the the time between each frame of animation is set globally using the `SetAllStateDelays()` method, the code is overall less prone to mistakes via typos.

It is worth noting that in the above, animated examples, StepMania's engine will start with the first frame and progress to the last one in order.  There are times when we may want to only animate through a portion of a sprite sheet at any given moment, like with this character sprite sheet from a typical 16bit JRPG:

<img src="{{ site.baseurl }}/images/guy 4x4.png">

If we want the *Sprite* actor to appear to be facing downward, then we'd only want StepMania to be animating through the first row of the sprite sheet.  Here's a way to handle that.

<span class="CodeExample-Title">A complex Sprite example:</span>
{% highlight lua linenos=table %}
-- duration between frames, in seconds
local duration_in_seconds = 0.15

-- We want SM5 to think of this as a single Sprite actor that sometimes
-- displays frames 0-3, and other times displays frames 8-11, so we're
-- going to need to manually specify each frame index like this.

-- The sequence of frames here corresponds with the physical layout of
-- the "guy 4x4.png" sprite sheet image shown above.
local frames = {
	Down = {
		{ Frame=0,	Delay=duration_in_seconds},
		{ Frame=1,	Delay=duration_in_seconds},
		{ Frame=2,	Delay=duration_in_seconds},
		{ Frame=3,	Delay=duration_in_seconds}
	},
	Left = {
		{ Frame=4,	Delay=duration_in_seconds},
		{ Frame=5,	Delay=duration_in_seconds},
		{ Frame=6,	Delay=duration_in_seconds},
		{ Frame=7,	Delay=duration_in_seconds}
	},
	Right = {
		{ Frame=8,	Delay=duration_in_seconds},
		{ Frame=9,	Delay=duration_in_seconds},
		{ Frame=10,	Delay=duration_in_seconds},
		{ Frame=11,	Delay=duration_in_seconds}
	},
	Up = {
		{ Frame=12,	Delay=duration_in_seconds},
		{ Frame=13,	Delay=duration_in_seconds},
		{ Frame=14,	Delay=duration_in_seconds},
		{ Frame=15,	Delay=duration_in_seconds}
	}
}


local af = ActorFrame{
	InitCommand=function(self) self:sleep(math.huge) end
}

af[#af+1] = Def.Sprite{
	Texture="guy 4x4.png" ),
	InitCommand=function(self)
		-- when not actively tweening across the screen, the Sprite should
		-- not animate, so as to appear to be "standing" in place
		self:animate(false)

		-- align to left and v-middle
		self:halign(0):valign(0.5)

		-- initialize the position
		self:Center()

		-- initialize the sprite state so that the sprite
		-- starts by facing downward
		self:SetStateProperties( frames.Down )
	end,

	-- In SM5, the StepMessage is broadcast whenever either player
	-- steps on a game button during gameplay.
	-- This doens't handle buttons like START or SELECT.
	StepMessageCommand=function(self, params)

		-- As an artibtrary decision for the sake of this example
		-- let's only pay attention to steps from PLAYER_1
		if params.PlayerNumber == PLAYER_1

			-- turn animation back on for a brief moment
			self:animate(true)

			-- apply a linear tween to move the sprite one directional unit
			self:linear(duration_in_seconds * 4)

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

			-- the Sprite has tweened, so stop animating it
			self:animate(false)
		end
	end
}

return af
{% endhighlight %}