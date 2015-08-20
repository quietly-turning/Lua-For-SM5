---
layout: default
title: About
chapter: 0
section: 1
---

  
# Section 0.1 – From &lt;<span class="nt">xml</span>&gt; To { <span class="kd" >lua</span> }

In StepMania theming/scripting, things drawn to the screen are *Actors*.  This was true in SM3.95 and remains true in SM5.

A typical SM3.95 XML file would feature an ActorFrame element which would contain various children Actors.  This model is conceptually the same in SM5, but uses `.lua` files instead of `.xml` files.  So, where Actors were represented by *XML elements* in SM3.95, they are **Lua tables** in SM5.

### Tables Within Tables Within...

An Actor is the most basic unit of StepMania scripting.  Virtually everything else that you work with in SM5 Lua, be it a Sprite, a BitmapText, or an ActorMultiVertex, is built on top of the foundation that Actor provides.

From a scripter's perspective, an Actor is a Lua table with a few special properties that the StepMania engine will look for.  Other StepMania elements that derive from Actor are also really just Lua tables as well.

So if you are familiar with *ActorFrames*, the StepMania element that serves as a container for manipulating multiple Actors simultaneously within itself, you can start to appreciate how an ActorFrame is a table that contains Actors which are tables.

It's tables all the way down. :)

### An Example SM3.95 XML File

SM3.95 had 17 unique Actor classes, each of which could be invoked with a corresponding XML element.  These SM3.95 Actor classes have been documented by Matt Gardner at the rhythmarcade.com wiki [Actor Classes page](http://rhythmarcade.com/wiki/stepmania/sm_395/theming/actorclasses).

A simple XML file containing some Actors commonly used in SM3.95 might look like:

<span class="CodeExample-Title">A typical SM3.95 XML script:</span>
 {% highlight XML linenos=table %}
<!-- ActorFrame is an Actor -->
<ActorFrame OnCommand="x,SCREEN_CENTER_X;y,SCREEN_CENTER_Y;sleep,9999">
	<children>

		<!-- Quad is an Actor -->
		<Quad
			 InitCommand="zoomto,50,137"
		/>

		<!-- BitmapText is also an Actor -->
		<BitmapText
			File="_eurostile normal"
			Text="Eat Poptarts."
		/>

		<!-- Sprite is, that's right, an Actor -->
		<Sprite
			Texture="chrismarks.png"
			Frame0000="0"
		/>

	</children>
</ActorFrame>
{% endhighlight %}

### The Example File Converted to SM5 Lua

In SM5, these same Actors exist (and quite a few more; 43 in total!), but the means of invoking them has changed since pure Lua files have replaced XML.  For a complete list of SM5 Actors, see [./Docs/ThemerDocs/actordef.txt](https://github.com/stepmania/stepmania/blob/master/Docs/Themerdocs/actordef.txt)


The most commonly used Actors will each be discussed in detail in the following sections.  For now, we'll start by looking at the *SimpleExample.xml* if we were to convert it to SM5 Lua:


<span class="CodeExample-Title">The same script written in SM5 Lua:</span>
{% highlight Lua linenos=table %}
-- start by defining an ActorFrame
-- we'll call it ExampleAF (example ActorFrame)
local ExampleAF = Def.ActorFrame{
	OnCommand=cmd(Center; sleep,9999),

	-- since Actors are just Lua tables
	-- we can nest them directly inside
	-- the parent ActorFrame table like this
	Def.Quad{
		InitCommand=cmd(zoomto,50,137)
	},

	-- note that since these are elements in
	-- a Lua table, everything is comma-delimited
	Def.BitmapText{
		Font="_common normal",
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
