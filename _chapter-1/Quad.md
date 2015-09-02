---
layout: default
title: Quad
chapter: 1
section: 1
---

# Section 1.1 &mdash; Quad

*Quad* actors are programmatically drawn *quad*rilaterals that can have properties like size, position, and color.  If you don't specify, Quad actors are white and have a height and width of 0 by default.

<span class="CodeExample-Title">A very simple Quad example:</span>
{% highlight lua linenos=table %}
-- a white quad with height and width of 100px
Def.Quad{
	Name="WhiteQuad",
	InitCommand=function(self)
		self:zoomto(100,100)
	end
}
{% endhighlight %}

Since Quads are fairly simple, let's use another example to animate some Quads and demonstrate a few new-to-SM5 features and shortcuts along the way.

<span class="CodeExample-Title">Three Quads with animation:</span>
{% highlight lua linenos=table %}
-- let's assume this file is being called via FGCHANGES from a simfile.
-- Like in SM3.95, Actors from FGCHANGES that are not actively tweening
-- are cleared from memory as the engine assumes they are "done."
-- To counteract this, we'll apply a sleep() tween to the parent ActorFrame

return Def.ActorFrame{
	-- the OnCommand here applies to the primary ActorFrame
	OnCommand=function(self)
		self:sleep(9999)
	end,

	-- a red quad that accelerates from offscreen-left to offscreen-right
	-- this makes use of the _screen and Color aliases
	Def.Quad{
		Name="RedQuad",
		InitCommand=function(self)
			self:zoomto(100,100)
			self:diffuse(Color.Red)
		end,
		OnCommand=function(self)
			self:xy( -100, _screen.cy )
			self:accelerate( 2 )
			self:x( _screen.w + 100 )
		end
	},

	-- a blue quad that decelerates from offscreen-top to offscreen-bottom
	-- this makes use of the xy() command, which is new to SM5
	-- as well as command-chaining (read more on the next page!)
	Def.Quad{
		Name="BlueQuad",
		InitCommand=function(self)
			self:zoomto( 100, 100 )
			self:diffuse( Color.Blue )
		end,
		OnCommand=function(self)
			self:xy( _screen.cx, -100)
			self:decelerate( 2 ):y( _screen.h + 100 )
			self:queuecommand( "TriggerSpin" )
		end,
		TriggerSpinCommand=function(self)
			local greenquad_af = self:GetParent():GetChild( "GreenQuadAF" )
			greenquad_af:GetChild( "GreenQuad" ):queuecommand( "Grow" )
		end
	},

	-- a green quad that waits for the two quads above to finish tweening,
	-- then grows out of the center of the screen while spinning
	--
	-- NOTE: We can't apply tween-based commands and actor effects like spin() simultaneously.
	-- zoomto() will override spin() for the duration of its linear tween.
	-- The way to achive the effect of spinning toward the viewer is to
	-- wrap the Quad in an ActorFrame, spin the ActorFrame, and zoom the Quad.
	Def.ActorFrame{
		Name="GreenQuadAF",
		InitCommand=function(self)
			self:Center()
			self:effectmagnitude(0,0,1):spin()
		end,

		Def.Quad{
			Name="GreenQuad",
			InitCommand=function(self)
				self:zoomto(0,0)
				self:diffuse(Color.Green)
			end,
			GrowCommand=function(self)
				self:linear(5):zoomto(_screen.w, _screen.h)
			end,
		}
	}
}
{% endhighlight %}

There are three things worth pointing out here.

### Only one Actor can be returned per file.
First, this example features three unique Quads acting independently within a single ActorFrame.  Because StepMania expects one actor to be returned per file, we return the primary ActorFrame, which includes the Quads inside.

### The *_fallback* theme has some helpful aliases.
Second, this example also uses a few helper tables defined in SM5's *_fallback* theme such as the
`Color` table from [02 Colors.lua](https://github.com/stepmania/stepmania/blob/master/Themes/_fallback/Scripts/02%20Colors.lua)  and the `_screen` table from [01 alias.lua](https://github.com/stepmania/stepmania/blob/master/Themes/_fallback/Scripts/01%20alias.lua).

### Commands can be chained.
Finally, this example introduces a new way to apply multiple commands to the same Actor via **command chaining**.  We see this in the example above on lines 24, 56, and 66.

 While commands *can* be chained ad infinitum, an appropriate rule of thumb is to chain contextually-related commands together, and start a new line when a new context arises.  For example, consider starting with a tween command and then successively chaining the commands that are to be tweened.