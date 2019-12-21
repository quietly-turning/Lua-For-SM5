import React, { Component } from "react";
import { Link } from "react-router-dom";

class Home extends Component {
	render() {
		return (
			<div>
				<h1>Lua for StepMania 5</h1>

				<p>
					Hello there!  In these pages, you&apos;ll find my <strong>Lua for SM5</strong> guide, comprised of various chapters organized under the headers <span className="d-none d-md-inline d-lg-inline d-xl-inline">on the right</span> <span className="d-xl-none d-lg-none d-md-none">at the bottom</span> of this page.
				</p>
				<p>
					If you&apos;re unsure of where to start, check out the chapter on <Link to="/Foreword">What Are Actors?</Link> to get a sense of how Lua files are organized in StepMania 5.
				</p>
				<p>
					StepMania 5&apos;s complete API documentation can be found in its Lua.xml file, which ships with releases of StepMania 5 in the <samp>./Docs/Luadoc/</samp> directory and can be viewed in most web browsers. I have also hosted a copy as part of this website: <Link to="/LuaAPI">Lua For SM5: Lua API</Link>.
				</p>
				<p>
					You can find additional resources for learning about Lua and SM5 scripting on the <Link to="/Resources">Other Resources</Link> page.
				</p>
			</div>
		);
	}
}

export default Home;