import React, { Component } from "react";

class Resources extends Component {
	render() {
		return (
			<div>
				<h1>Other Resources</h1>

				<h2>Learning Lua</h2>

				<ul>
					<li>
						<a target="_blank" rel="noopener noreferrer" href="http://www.tutorialspoint.com/lua/">TutorialsPoint Lua Guide</a>
					</li>
					<li>
						<a target="_blank" rel="noopener noreferrer" href="https://www.lua.org/pil/contents.html">Programming in Lua</a>
					</li>
				</ul>

				<h2>Theming for StepMania 5</h2>
				<ul>
					<li><a target="_blank" rel="noopener noreferrer" href="https://github.com/stepmania/stepmania/wiki/Theming">StepMania&apos;s GitHub Wiki Theming Page</a></li>
					<li><a target="_blank" rel="noopener noreferrer" href="http://stepmaniaonline.net/forum/viewtopic.php?f=8&t=4893">SpoOky&apos;s SM5 Theming Guide</a></li>
				</ul>

				<h2>Theming for StepMania 5.2</h2>

				<p>
					SM5.2 will offer lots of new features and many are documented here:
				</p>

				<ul>
					<li>
						<a target="_blank" rel="noopener noreferrer" href="https://github.com/stepmania/stepmania/blob/5_1_0/Docs/Themerdocs/item_scroller.md">Lua Item Scroller</a>
					</li>
					<li>
						<a target="_blank" rel="noopener noreferrer" href="https://github.com/stepmania/stepmania/blob/5_1_0/Docs/Themerdocs/lua_config_system.md">Lua Preference System</a>
					</li>
				</ul>



				<h2>SM/SSC File Documentation</h2>
				<ul>
					<li>
						<a target="_blank" rel="noopener noreferrer" href="https://github.com/stepmania/stepmania/wiki/sm">.sm File Format</a>
					</li>
					<li>
						<a target="_blank" rel="noopener noreferrer" href="https://github.com/stepmania/stepmania/wiki/Note-Types">.ssc NoteTypes </a>
					</li>
				</ul>
			</div>
		);
	}
}

export default Resources;