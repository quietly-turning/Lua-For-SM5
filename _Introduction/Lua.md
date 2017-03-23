---
layout: default
title: Lua for those coming from SM3.95
section: 2
---

# Section 0.2

## Differences between Lua 5.0 and Lua 5.1

SM3.95 used [Lua 5.0](http://www.lua.org/versions.html\#5.0), while SM5 currently uses [Lua 5.1](http://www.lua.org/versions.html\#5.1).
The primary differences that will likely impact your scripting experience are:

### Modulus Operator as %
Lua 5.0 required `math.mod()` to perform modulo operations, while Lua 5.1 introduced a proper modulus operator.

<span class="CodeExample-Title">Modulus operator example:</span>
{% highlight Lua linenos=table %}
local teamdragonforce = 3 % 2
print(teamdragonforce)
-- output: 1
{% endhighlight %}

### Table Size Operator as &#35;
Lua 5.0 required the  `table.getn()` function to determine the size of an indexed table, while Lua 5.1 introduced a simple operator for this common task.

<span class="CodeExample-Title">Indexed table size operator:</span>
{% highlight Lua linenos=table %}
-- this table is indexed, so the # operator works
local StomperZ = { "fast", "brutal", "bearlike" }
print(#StomperZ)
-- output: 3

-- this table is key/value, so the # operator does NOT work
local NotIndexed ={
	blah = "fast",
	nah = "brutal",
	whatever = "bearlike"
}
print(#NotIndexed)
-- output: 0
{% endhighlight %}

### Simple For Loop Deprecation
For the official explanation, read <http://www.luafaq.org/#T1.13>


<hr>

## &lt;<span class="nt">XML</span>&gt; in SM3.95 converted to { <span class="kd" >Lua</span> } in SM5

A typical SM3.95 XML file would feature an ActorFrame element which would contain various children Actors.  This model is conceptually the same in SM5, but uses `.lua` files instead of `.xml` files.  So, where Actors were represented by *XML elements* in SM3.95, they are **Lua tables** in SM5.

### An Example SM3.95 XML File

SM3.95 had 17 unique Actor classes, each of which could be invoked with a corresponding XML element.

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

