---
layout: default
title: BitmapText
chapter: 1
section: 2
---


# Section 1.2 – BitmapText

*BitmapText* Actors are used to display text on the screen. As Lua tables, they
have two unique elements, `Font` and `Text`.  `Font` should be set to
any font in the current or *_fallback* theme's *./Font* directory. `Text` should
be set to a string value, but it can be left empty or not declared at all if you intend
to programmatically set the text later with the `settext()` method.


{% highlight lua linenos=table %}
-- In SM5, it is possible (and encouraged!) to create local variables
-- that have scope over the current file, like this.
local phrases = {
	"There's the boys.",
	"Just move faster.",
	"Worst in the world.",
	"#bottomstruggles"
}

return Def.ActorFrame{
	InitCommand=cmd(sleep, 9999),

	-- Remember that queuecommand() waits until the next tick of the engine's
	-- game loop to execute whatever command we are queueing.
	OnCommand=cmd(queuecommand, "ChooseAPhrase"),
	ChooseAPhraseCommand=function(self)
		-- When passed an integer, math.random() returns a random
		-- integer that is no greater than the number you pass it,
		-- but at least 1.  So, in this case, since #phrases = 4
		-- i will be assigned to 1, 2, 3 or 4.
		local i = math.random( #phrases )

		-- In contrast, playcommand() will attempt to execute immediately.
		-- playcommand() also allows us to pass a table of arguments to
		-- the next command we want to run.  In this way, we can pass
		-- variables that are otherwise local to this function of this
		-- ActorFrame to the desired function of the desired BitmapText.
		self:GetChild("CatchPhrase"):playcommand("Update", {PhraseIndex=i})
	end,

	Def.BitmapText{
		Name="CatchPhrase",
		Font="Common normal",
		InitCommand=cmd(diffuse, color("#FEDCBA"); Center),
		UpdateCommand=function(self, params)
			-- The "params" argument comes in as a table with a single element,
			-- "PhraseIndex"; use that index to get one of the string phrases from
			-- the phrases variable and set this BitmapText to display that phrase.
			self:settext( phrases[ params.PhraseIndex ] )
		end
	}
}
{% endhighlight %}

The example above is admittedly rather artificial for the sake of demonstrating how to pass
variables when issuing a `playcommand()` call.  The random index `i` could have just
as easily been generated at the top of the file next to `local phrases` and not needed to
be passed between the Actors' functions.

Still, it is good to know that this can be done.  Keeping variables local (to a file, to a function,
etc.) is good practice to mitigate polluting the global Lua namespace with an abundance of
single-use variables.  In this regard, it can be helpful to know as many ways to pass those
local variables (between files, between functions, etc.) as possible.

<hr>

Finally, if you sift through enough SM5 theme code, you'll likely encounter a helper function
`LoadFont()`.  It was essentially a wrapper method for Def.BitmapText{} that served to
workaround some of BitmapText's quirks/bugs that have since been fixed.  There should be
no need to use it any longer.