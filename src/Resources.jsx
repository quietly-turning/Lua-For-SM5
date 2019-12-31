import React, { Component } from "react";

class Resources extends Component {
	render() {
		return (
			<div>
				<h1>Other Resources</h1>

				<h2>Learning Lua</h2>

				<ul>
					<li>
						<a target="_blank" rel="noopener noreferrer" href="https://www.tutorialspoint.com/lua/">TutorialsPoint Lua Guide</a>
					</li>
					<li>
						<a target="_blank" rel="noopener noreferrer" href="https://www.lua.org/pil/contents.html">Programming in Lua</a>
					</li>
				</ul>

				<h2>Theming for StepMania 5</h2>
				<ul>
					<li><a target="_blank" rel="noopener noreferrer" href="https://github.com/stepmania/stepmania/wiki/Theming">StepMania&apos;s GitHub Wiki Theming Page</a></li>
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