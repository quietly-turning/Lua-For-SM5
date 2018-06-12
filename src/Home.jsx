import React, { Component } from "react";
import { Link } from "react-router-dom";

class Home extends Component {
	render() {
		return (
			<div>
				<h1>Lua for StepMania 5</h1>

				<p>
					Hello there!  In these pages, you&apos;ll find my <strong>Lua for SM5</strong> guide, comprised of several chapters each with multiple sub-sections.
				</p>
				<p>
					Please note that this is not exhaustive documentation on every feature StepMania 5 offers.
					To the best of my knowledge, no such resource exists, though this guide aims to make it easier to get started with SM5 Lua scripting.
				</p>
				<p>
					The closest thing to proper API documentation that SM5 currently has is its Lua.xml file, which comes with StepMania 5 in the <samp>./Docs/Luadoc/</samp> directory and can be viewed in most web browsers. I have also hosted a copy as part of this website: <a href="/API/Lua.xml">Lua For SM5: Lua API</a>.
				</p>
				<p>
					You can find further resources for learning about Lua and SM5 scripting on the <Link to="/Resources">Other Resources</Link> page.
				</p>
				<p>
					-Dan Guzek
				</p>
			</div>
		);
	}
}

export default Home;