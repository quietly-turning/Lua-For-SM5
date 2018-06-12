import React, { Component } from "react";
import Highlight from 'react-highlight';

class Lua extends Component {
	render() {
		return (
		<div>
			<h1>Differences between Lua 5.0 and Lua 5.1</h1>

			<p>SM3.95 used <a href="http://www.lua.org/versions.html#5.0">Lua 5.0</a>, while SM5 currently uses <a href="http://www.lua.org/versions.html#5.1">Lua 5.1</a>.
			The primary differences that will likely impact your scripting experience are:</p>

			<h3>Modulus Operator as %</h3>

			<p>Lua 5.0 required <code>math.mod()</code> to perform modulo operations, while Lua 5.1 introduced a proper modulus operator.</p>

			<span className="CodeExample-Title">Modulus operator example:</span>
			<Highlight className="lua">
{`
local teamdragonforce = 3 % 2
print(teamdragonforce)
-- output: 1
`}
			</Highlight>

			<h3>Table Size Operator as &#35;</h3>

			<p>Lua 5.0 required the  <code>table.getn()</code> function to determine the size of an indexed table, while Lua 5.1 introduced a simple operator for this common task.</p>

			<span className="CodeExample-Title">Indexed table size operator:</span>
			<Highlight className="lua">
{`
-- this table is indexed, so the # operator works
local StomperZ = { "fast", "brutal", "bearlike" }
print(#StomperZ)
-- output: 3

-- this table is key/value, so the # operator does NOT work
local NotIndexed = {
    blah = "fast",
    nah = "brutal",
    whatever = "bearlike"
}
print(#NotIndexed)
-- output: 0
`}
			</Highlight>

			<h3>Simple For Loop Deprecation</h3>

			<p>For the official explanation, read <a href="http://www.luafaq.org/#T1.13">http://www.luafaq.org/#T1.13</a></p>

			<hr />

			<h2>&lt;XML&gt; in SM3.95 converted to &#123; Lua &#125; in SM5</h2>

			<p>A typical SM3.95 XML file would feature an ActorFrame element which would contain various children Actors.  This model is conceptually the same in SM5, but uses <code>.lua</code> files instead of <code>.xml</code> files.  So, where Actors were represented by <em>XML elements</em> in SM3.95, they are <strong>Lua tables</strong> in SM5.</p>

			<h3>An Example SM3.95 XML File</h3>

			<p>SM3.95 had 17 unique Actor classes, each of which could be invoked with a corresponding XML element.</p>

			<p>A simple XML file containing some Actors commonly used in SM3.95 might look like:</p>

			<span className="CodeExample-Title">A typical SM3.95 XML script:</span>
			<Highlight className="xml">
{`
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
`}
			</Highlight>
			<h3>The Example File Converted to SM5 Lua</h3>

			<p>In SM5, these same Actors exist (and quite a few more; 43 in total!), but the means of invoking them has changed since pure Lua files have replaced XML.  For a complete list of SM5 Actors, see <a href="https://github.com/stepmania/stepmania/blob/master/Docs/Themerdocs/actordef.txt">./Docs/ThemerDocs/actordef.txt</a></p>

			<p>The most commonly used Actors will each be discussed in detail in the following sections.  For now, we&apos;ll start by looking at the <em>SimpleExample.xml</em> if we were to convert it to SM5 Lua:</p>

			<span className="CodeExample-Title">The same script written in SM5 Lua:</span>
			<Highlight className="lua">
{`
--start by defining an ActorFrame
--we'll call it ExampleAF (example ActorFrame)
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

--since ExampleAF is an indexed Lua table, we can also
--add elements to its next index externally like this:
ExampleAF[#ExampleAF + 1] = Def.Sprite{
    Texture="chrismarks.png"
}

--Every Lua Theme/BGCHANGE/FGCHANGE file in SM5 must return some
--sort of Actor. Typically, we end up returning an ActorFrame.
return ExampleAF
`}
			</Highlight>
		</div>
		);
	}
}

export default Lua