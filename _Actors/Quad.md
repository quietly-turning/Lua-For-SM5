---
layout: default
title: Quad
chapter: 1
section: 1
description: programmatically draw and manipulate quadrilaterals
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

A common question that people new to StepMania scripting have is:

**Where are those commands like** `zoomto()` **coming from?**

Keeping in mind that a *Quad* is a specific type of StepMania *Actor*, we can look to StepMania's Lua API for a complete list of methods available to all <a href="/Lua-For-SM5/API/Lua.xml#Actor">Actor objects</a>.  (Note that in your web-browser, you may need to click to expand the list of methods linked to.)

## A More Advanced Example

Since Quads are fairly simple, let's use another example to animate some Quads.  This example makes use of a new-to-SM5 feature, command-chaining, which is discussed more in-depth <a href="{{site.baseurl}}/Best_Practices/CommandChaining.html">in Chapter 3.2</a>.

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
			self:zoomto(100,100):diffuse(Color.Red)
		end,
		OnCommand=function(self)
			self:xy( -100, _screen.cy )
				:accelerate( 2 ):x( _screen.w + 100 )
		end
	},

	-- a blue quad that decelerates from offscreen-top to offscreen-bottom
	-- this makes use of the xy() command, which is new to SM5
	-- as well as command-chaining (read more on the next page!)
	Def.Quad{
		Name="BlueQuad",
		InitCommand=function(self)
			self:zoomto( 100, 100 ):diffuse( Color.Blue )
		end,
		OnCommand=function(self)
			self:xy( _screen.cx, -100)
				:decelerate( 2 ):y( _screen.h + 100 )
				:queuecommand( "TriggerSpin" )
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
				:spin():effectmagnitude(0,0,180)
		end,

		Def.Quad{
			Name="GreenQuad",
			InitCommand=function(self)
				self:zoomto(0,0):diffuse(Color.Green)
			end,
			GrowCommand=function(self)
				self:linear(5):zoomto(_screen.w, _screen.h)
			end,
		}
	}
}
{% endhighlight %}



## The *_fallback* theme has some helpful aliases.
This example also uses a few helper tables defined in SM5's *_fallback* theme such as the
`Color` table from [02 Colors.lua](https://github.com/stepmania/stepmania/blob/master/Themes/_fallback/Scripts/02%20Colors.lua)  and the `_screen` table from [01 alias.lua](https://github.com/stepmania/stepmania/blob/master/Themes/_fallback/Scripts/01%20alias.lua).
