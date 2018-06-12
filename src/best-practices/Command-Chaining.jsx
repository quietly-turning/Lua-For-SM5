import React, { Component } from "react";
import Highlight from 'react-highlight';

class Debugging extends Component {
	render() {
		return (
			<div>

			<h1>Command-Chaining</h1>

			<p>In StepMania 5, commands applied to actors can be chained, resulting in a more clean and terse syntax than was possible before.</p>

			<p>The following two syntaxes produce the same results:</p>

			<span className="CodeExample-Title">Long Form</span>
			<Highlight className="lua">
{`
	Def.Quad{
		OnCommand=function(self)
			self:zoomto(100,200)
			self:xy(_screen.cx, 100)
			self:diffuse(Color.Green)
			self:linear(1)
			self:y(_screen.h-100)
		end
	}
`}
			</Highlight>

			<span className="CodeExample-Title">Condensed Via Command Chaining</span>
			<Highlight className="lua">
{`
Def.Quad{
	OnCommand=function(self)
		self:zoomto(100,200):xy(_screen.cx, 100):diffuse(Color.Green)
			:linear(1):y(_screen.h-100)
	end
}
`}
			</Highlight>

			<p>While commands <em>can</em> be chained ad infinitum, an appropriate rule of thumb is to chain contextually-related commands together, and start a new line when a new context arises.  For example, consider starting with a tween command and then successively chaining the commands that are to be tweened.</p>

			</div>
		);
	}
}

export default Debugging;