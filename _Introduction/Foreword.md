---
layout: default
title: What Are Actors?
section: 1
---


# Section 0.1 – What are Actors?


## Tables Within Tables Within...

An Actor is the most basic unit of StepMania scripting.  Virtually everything else that you work with in SM5 Lua, be it a Sprite, a BitmapText, or an ActorMultiVertex, is built on top of the foundation that Actor provides.

From a scripter's perspective, an Actor is a Lua table with a few special properties that the StepMania engine will look for.  Other StepMania elements that derive from Actor are also really just Lua tables as well.

So if you are familiar with *ActorFrames*, the StepMania element that serves as a container for manipulating multiple Actors simultaneously within itself, you can start to appreciate how an ActorFrame is a table that contains Actors which are tables.

It's tables all the way down.

## Types of Actors

There are 43 specialized types of Actors available to StepMania's Lua scripting interface.  Each type has unique methods available to it and a unique use-case.  For example,

* `Quad` actors are quadrilaterals that you can programmatically manipulate
* `BitmapText` actors are used to draw text to the screen
* `ActorMultiVertex` actors are arbitrary polygons that you can programmatically manipulate
* `Sprite` actors are used to load visual assets like png images or avi movies
* `ActorFrame` actors serve as containers for other actors, and are useful when you want to manipulate a group of actors simultaneously, rather than individually
* etc.

For a complete list of SM5 Actor types, see [./Docs/ThemerDocs/actordef.txt](https://github.com/stepmania/stepmania/blob/master/Docs/Themerdocs/actordef.txt)

## An Example SM5 Lua Script

The most commonly used Actors will each be discussed in detail across Chapter 1.  For now, we'll start by looking at a simple Lua script for StepMania 5.


<span class="CodeExample-Title">A Simple SM5 Lua Script:</span>
{% highlight Lua linenos %}
-- start by defining an ActorFrame
-- we'll call it ExampleAF (example ActorFrame)
local ExampleAF = Def.ActorFrame{
	OnCommand=function(self)
		self:Center():sleep(9999)
	end,

	-- since Actors are just Lua tables
	-- we can nest them directly inside
	-- the parent ActorFrame table like this
	Def.Quad{
		InitCommand=function(self)
			self:zoomto(50,137)
		end
	},

	-- note that since these are elements in
	-- a Lua table, everything is comma-delimited
	Def.BitmapText{
		Font="Common Normal",
		Text="Eat Poptarts."
	}
}


-- since ExampleAF is an indexed Lua table, we can also
-- add elements to its next index externally like this:
ExampleAF[#ExampleAF + 1] = Def.Sprite{
	Texture="chrismarks.png"
}

-- Every Lua Theme/BGCHANGE/FGCHANGE file in SM5 must return some
-- sort of Actor. Typically, we end up returning an ActorFrame.
return ExampleAF
{% endhighlight %}


## Only one Actor can be returned per file.

The StepMania engine expects one Actor to be returned per Lua file, yet the example above features four Actors:

* 1 ActorFrame
* 1 Quad
* 1 BitmapText
* 1 Sprite

How do we make this work?

The solution reveals a prominent design paradigm in StepMania scripting – put all other Actors inside the ActorFrame and return the ActorFrame.  An ActorFrame is just one type of Actor, and any valid Actor may be returned.

If your Lua file is *very* simple, you may only have one Actor, maybe a Sprite or a Quad.  In such situations, it is not necessary to wrap the single Actor in an ActorFrame; *any valid StepMania Actor may be returned.*

Still, most files end up being complex enough to warrant using an ActorFrame.