import React, { Component } from "react";
import Highlight from 'react-highlight';

class BitmapText extends Component {
	render() {
		return (
			<div>
			<h1>BitmapText</h1>

			<p><em>BitmapText</em> Actors are used to display text on the screen.</p>

			<p>As Lua tables, they have two unique elements, <code>Font</code> and <code>Text</code>.  <code>Font</code> should be set to any font in the current or <em>_fallback</em> theme&apos;s <em>./Font</em> directory. <code>Text</code> should be set to a string value, but it can be left empty or not declared at all if you intend to programmatically set the text later with the <code>settext()</code> method.</p>

			<span className="CodeExample-Title">Display one randomly selected string from a table:</span>
			<Highlight className="lua">
{`
-- This "phrases" table contains a list of strings.  We're going to randomly
-- select one and display it in the BitmapText actor below. In SM5, it is
-- possible (and encouraged!) to create local variables that have scope over
-- the current file, like this.
local phrases = {
	"There's the boys.",
	"Just move faster.",
	"Worst in the world.",
	"#bottomstruggles"
}

return Def.ActorFrame{
	InitCommand=function(self)
		-- Remember that queuecommand() waits until the next tick of the engine's
		-- game loop to execute whatever command we are queueing.
		self:queuecommand("ChooseAPhrase"):sleep(9999)
	end,

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
`}
			</Highlight>

			<p>The example above is admittedly rather artificial for the sake of demonstrating how to pass variables when issuing a <code>playcommand()</code> call.  The random index <code>i</code> could have just as easily been generated at the top of the file next to <code>local phrases</code> and not needed to be passed between the Actors&apos; functions.</p>

			<p>Still, it is good to know that this can be done.  Keeping variables local (to a file, to a function, etc.) is good practice to mitigate polluting the global Lua namespace with an abundance of single-use variables.  In this regard, it can be helpful to know as many ways to pass those local variables (between files, between functions, etc.) as possible.</p>

			<hr />

			<p>Finally, if you sift through enough SM5 theme code, you&apos;ll likely encounter a helper function <code>LoadFont()</code>.  It was essentially a wrapper method for Def.BitmapText{} that served to workaround some of BitmapText&apos;s quirks/bugs that have since been fixed.  There should be no need to use it any longer.</p>
			</div>
		);
	}
}

export default BitmapText;