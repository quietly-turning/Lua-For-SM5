---
layout: default
title: LoadActor()
chapter: 1
section: 4.1
subsection: 1
difficulty: intermediate
---


## Section 1.4.1 &mdash; LoadActor()

*LoadActor()* is a helper function with some extremely useful properties that make a staple of any SM5 Lua scripting endeavor.

### First Argument - A file path to Load

The function itself requires at least one argument, a string value of the file to load.  Let's consider a simple example, the code from [the page on Def.Sprite]({{site.baseurl}}/chapter-1/Sprite.html)  , now rewritten to use *LoadActor()*:

<span class="CodeExample-Title">A very simple LoadActor example:</span>
{% highlight lua linenos=table %}

-- pass the function a path to an image file
-- and append a table with the relevant commands
LoadActor( "OverlayAttachedGirlfriend.png" )..{
	Name="Girlfriend",
	InitCommand=function(self)
		self:zoom(0.5):Center()
	end
}
{% endhighlight %}

As [its definition in the _fallback theme demonstrates ](https://github.com/stepmania/stepmania/blob/a888506b3270d6c66d12cb2165fb8d4b1a7d978f/Themes/_fallback/Scripts/02%20ActorDef.lua#L95-L159), *LoadActor()* can load Lua files, image/video files, sound files, models, and directories.  In this manner, it can effectively take the place of knowing when to use Def.Sprite{} or Def.Model{} or Def.Actor{}.

Since there currently is no Def.ActorSound{}, *LoadActor()* is the only way to work with [ActorSound actors]({{site.baseurl}}/chapter-1/ActorSound.html).  If you pass *LoadActor()* a sound file, it will infer that you want an ActorSound, and you'll be able to use ActorSound's special methods.

### Second Argument - A table to pass into the loaded file

The optional second argument of LoadActor() is where it really shines, however.  Let's look at this slightly more complex example which uses two Lua files.

**Primary.lua** will load **Box.lua** once for each available human player and pass in unique properties to each.  If only PLAYER_1 is available, only the red quadrilateral on the left will be drawn.  If only PLAYER_2 is available, only the blue quadrilateral on the right will be drawn.

<img src="{{ site.baseurl }}/images/loadactor.png">

This sort of setup allows us to keep generic code definitions in files like Box.lua, and load them as needed from the primary file with specific values passed in.

<span class="CodeExample-Title">Primary.lua</span>
{% highlight lua linenos=table %}
local af = Def.ActorFrame{
	InitCommand=function(self) self:sleep(9999):Center() end
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

	-- Tranform a player enum string valu into the part after
	-- the underscore with the ToEnumShortString() helper function.

	-- In this case "PlayerNumber_P1" becomes "P1"
	-- and "PlayerNumber_P2" becomes "P2"
	local pn = ToEnumShortString(player)

	-- The contents of Box.lua return a Quad.  Keep reading!
	-- Pass the specific box values we want into the file.
	af[#af+1] = LoadActor( "./Box.lua", box_values[ pn ] )
end

return af
{% endhighlight %}


<span class="CodeExample-Title">Box.lua</span>
{% highlight lua linenos=table %}
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
{% endhighlight %}
