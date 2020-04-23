import React, { Component } from "react";
import Highlight from 'react-highlight';
import { Link } from "react-router-dom";

class BitmapText extends Component {
	render() {
		return (
			<div>
			<h1>BitmapText</h1>

			<p><em>BitmapText</em> Actors are used to display text on the screen.</p>

			<p>As Lua tables, they have two unique elements, <code>Font</code> and <code>Text</code>.  <code>Font</code> should be set to any font in the current or <em>_fallback</em> theme&apos;s <em>./Font</em> directory. <code>Text</code> should be set to a string value, but it can be left empty or not declared at all if you intend to programmatically set the text later with the <code>settext()</code> method.</p>

			<p>Here is a very simple example that would display the text "Hello SM5!"</p>
			<span className="CodeExample-Title">Simple BitmapText example</span>
			<Highlight className="lua">
{`Def.BitmapText{
	Font="Common normal",
	Text="Hello SM5!",
	InitCommand=function(self) self:Center() end
}
`}
			</Highlight>

			<p>StepMania 5&apos;s <em>_fallback</em> theme defines a helper function, <code>LoadFont()</code>, that can be used to simplify the above code somewhat.</p>

			<span className="CodeExample-Title">BitmapText example using LoadFont()</span>
			<Highlight className="lua">
{`LoadFont("Common normal")..{
	Text="Hello SM5!",
	InitCommand=function(self) self:Center() end
}
`}
			</Highlight>

			<hr />

			<h3>Loading Custom Fonts within a Scripted Simfile</h3>

			<p>Note that the <code>LoadFont()</code> helper function can only be used to load BitmapText fonts contained within the current theme&apos;s <code>./Fonts/</code> directory.
			 If you are working within the context of a <Link to="/Lua-For-SM5/Mod-Chart-Setup">scripted simfile</Link> and are trying to load a custom BitmapText font that is located within the simfile directory itself, you can do so like this:</p>

			<span className="CodeExample-Title">loading a custom BitmapText from within a simfile</span>
			<Highlight className="lua">
{`Def.BitmapText{
    File=GAMESTATE:GetCurrentSong():GetSongDir().."Fonts/helvetica neue/_helvetica neue 20px.ini",
    Text="Hello, World!",
    InitCommand=function(self) self:diffuse(1,1,1,1):Center():shadowlength(0.75) end
}
`}
</Highlight>

			<p>The program used to turn ttf fonts into spritesheets that StepMania can use comes bundled with release versions of SM5 for Windows in the <code>./Program/</code> folder, and is titled <strong>Texture Font Generator.exe</strong>.
				While is it Windows-only, it works great on macOS using <a href="https://www.davidbaumgold.com/tutorials/wine-mac/">Wine</a>.</p>

			<p>When loading custom fonts within scripted simfiles like this, it may be necessary to modify the ini file that <em>Texture Font Generator.exe</em> outputs for character widths to be respected.</p>



			<span className="CodeExample-Title">the ini file Texture Font Generator will give you</span>
			<Highlight className="ini">
{`[common]
Baseline=20
# etc.

[main]
Line  0= !"$%&'()*+,-.
Line  1=/0123456789:;<
Line  2=>?@ABCDEFGHIJKL
Line  3=MNOPQRSTUVWXYZ
Line  4=\\]^_abcdefghij
# etc.

0=6
1=5
2=7
3=11
4=11
5=18
# etc.
`}
</Highlight>


			<p>If you find that character widths seem incorrect, you may be able to fix this issue by removing the <code>[main]</code> section from the font's ini file so that everything is defined under <code>[common]</code> like this:</p>

			<span className="CodeExample-Title">what you may need to change the ini file to</span>
			<Highlight className="ini">
{`[common]
Baseline=20
# etc.

Line  0= !"$%&'()*+,-.
Line  1=/0123456789:;<
Line  2=>?@ABCDEFGHIJKL
Line  3=MNOPQRSTUVWXYZ
Line  4=\\]^_abcdefghij
# etc.

0=6
1=5
2=7
3=11
4=11
5=18
# etc.
`}
</Highlight>




			<hr />

			<h3>Dynamically Changing Text Using <code>settext()</code></h3>

			<p>Here is a more complex example that display a randomly selected string out of a Lua table of possibilities.</p>

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
		self:queuecommand("ChooseAPhrase")
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

	LoadFont("Common normal")..{
		Name="CatchPhrase",
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

			</div>
		);
	}
}

export default BitmapText;