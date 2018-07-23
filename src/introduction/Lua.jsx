import React, { Component } from "react";
import Highlight from 'react-highlight';
import { Link } from "react-router-dom";

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

			<h3>Dynamically Adding Actors in SM5</h3>
			<p>We can take advantage of the idea that SM5 uses the Lua rather than XML to dynamically add actors to an ActorFrame.  Depending on the scenario and the number of Actors being added to an ActorFrame, this can <em>greatly</em> reduce the lines of code you&apos;ll need to write.</p>

			<p>Imagine that you have a single png asset, <em>dog.png</em> and you want five instances of it to appear on the screen. You&apos;d like the end result to look like this:</p>

			<p><img alt="" className="img-fluid" src="/Lua-For-SM5/img/dogs.png" /></p>

	  		<p>The basic idea is the same regardless of whether you are using SM3.95 or SM5: you&apos;ll need to define five <Link to="/Def.Sprite">Sprite Actors</Link> within your main ActorFrame.  To achieve this in SM3.95&apos;s XML, you could do something like this:</p>

			<span className="CodeExample-Title">Five Dogs in XML:</span>
			<Highlight className="xml">
{`<ActorFrame OnCommand="sleep,9999">
    <children>
	    <Sprite
			Name="sprite 1"
			Texture="./dog.png"
			InitCommand="x,50;y,50"
	    />
	    <Sprite
			Name="sprite 2"
			Texture="./dog.png"
			InitCommand="x,150;y,150"
	    />
	    <Sprite
			Name="sprite 3"
			Texture="./dog.png"
			InitCommand="x,250;y,250"
	    />
	    <Sprite
			Name="sprite 4"
			Texture="./dog.png"
			InitCommand="x,350;y,350"
	    />
	    <Sprite
			Name="sprite 5"
			Texture="./dog.png"
			InitCommand="x,450;y,450"
	    />
	</children>
</ActorFrame>
`}
			</Highlight>

			<p>That&apos;s about 30 lines of code already to basically do nearly the same thing five times.  If you&apos;re thinking that a <strong>loop</strong> might be handy here, you&apos;re on <em>exactly</em> the right track!  Let&apos;s rewrite that XML to be Lua for SM5.</p>

			<span className="CodeExample-Title">Five Dogs in Lua:</span>
			<Highlight className="lua">
{`local af = Def.ActorFrame{
	OnCommand=function(self) self:sleep(999) end
}

-- loop from 0 to 4 and add a Sprite Actor to the af ActorFrame each time
for i=0,4 do
	af[#af+1] = LoadActor("./dog.png")..{
		Name="sprite " .. i+1,
		InitCommand=function(self)
			self:xy(i*100+50, i*100+50)
		end
	}
end

return af
`}
			</Highlight>

			<p>We were able to accomplish the same effect using a <strong>numerical for loop</strong> in SM5&apos;s Lua in only 15 lines!</p>

			<p>This is a modest improvement already, but imagine if we wanted to add 100 or even 1000 instances of <em>dog.png</em> to the screen.  With XML, it is necessary to explicitly define each Actor you want in your main ActorFrame, while with Lua, it is only necessary to increase the loop&apos;s stop value from <code>4</code> to a different number.</p>

		</div>
		);
	}
}

export default Lua