import React, { Component } from "react";
import Highlight from 'react-highlight';
import { Link } from "react-router-dom";

class Model extends Component {
	render() {
		return (
			<div>
				<h1>Model</h1>

				<p className="alert alert-info"><em>This article was graciously contributed by <a href="https://github.com/JoseVarelaP">JoseVarelaP</a>!</em></p>

				<p>
					<em>Model</em> is an actor class used to load 3D models into StepMania 5.  At this time, StepMania 5 only supports one format: <strong><em>MilkShape 3D ASCII</em></strong>.  This means that modeling must be done using the MilkShape 3D software which is only for Windows OS.
				</p>

				<p>Let&apos;s start by looking at very simple example:</p>

				<span className="CodeExample-Title">Simple Def.Model Example</span>
				<Highlight className="lua">
{`Def.Model {
	Meshes="MyModel.txt",
	Materials="MyModel.txt",
	Bones="MyModel.txt",
	OnCommand=function(self)
		self:Center()
	end,
}
`}
			  	</Highlight>

				<p>
					This example will load a plaintext file named <code>MyModel.txt</code> that was exported from MilkShape 3D in the <em>MilkShape 3D ASCII</em> format.  That single file will contain all the data needed to for a <code>Def.Model</code>, including the <code>Meshes</code>, <code>Materials</code>, and <code>Bones</code>.
				</p>


			  <h3>Meshes, Materials, and Bones</h3>

			  <p><strong>Meshes</strong> are the composition and structure of the <code>Model</code>.  This data represents the vertices that make the <code>Model</code> take shape.</p>

			  <p><strong>Materials</strong> are the textures that the model will use. These can be any of the image formats list in the <Link to="Supported-File-Extensions">Supported File Extensions</Link> page. They can also be <em>.ini</em> files that define animated textures on a <Link to="Def.Sprite">Def.Sprite</Link>.</p>

			  <p><strong>Bones</strong> make the model come to life. They can be defined within the primary model file, or, in the case of Dancing Characters, be controlled via a separate file that only contains the bones.</p>

<p>In the above example, all three attributes used the same filepath; all the necessary data was contained within a single file.  It is possible to configure the MilkShape 3D software to output distinct files for meshes, materials, and bones, and set each <code>Def.Model</code> attribute accordingly, but that is outside the scope of this lesson.</p>

				<p className="alert alert-warning">
					All three attributes <strong>must</strong> be provided as paths to resources that can be loaded or StepMania will crash.  If you wish to load the <code>Model</code> without having to add bones, use <Link to="LoadActor">LoadActor()</Link> instead.
				</p>


			  <h3>Dancing Character Models</h3>
			  <p>While Dancing Characters typically appear in ScreenGameplay, it is possible to load them into any screen using <code>Def.Model</code>.  The following example can be used to load a randomly selected dancing character into the scene.</p>


				<span className="CodeExample-Title">Random Dancing Character</span>
				<Highlight className="lua">
{`-- This will load a random character from SM5's ./Characters folder
Def.Model {
	Meshes=CHARMAN:GetRandomCharacter():GetModelPath(),
	Materials=CHARMAN:GetRandomCharacter():GetModelPath(),
	Bones=CHARMAN:GetRandomCharacter():GetModelPath(),
	OnCommand=function(self)
		self:Center()
	end,
}
`}
				</Highlight>

				<p><img alt="" className="img-fluid" src="/Lua-For-SM5/img/Model-Faraway.png" /></p>

				<p>Wait a second - why is the model so far away?</p>


				<p>This is caused by how most 3D modelers have made their models to function with the corresponding <em>DDR-PC bones</em>, which are the most commonly used bones for dancing characters in StepMania.  As a result, dancing characters typically appear tiny when used outside of gameplay.</p>

				<p>Another thing to note is how the model is presented by default – it&apos;s facing away from us, the viewer.  This behavior can be changed by rotating on the <code>y</code> axis and explicitly setting a <code>z</code> value.</p>


				<span className="CodeExample-Title">Random Dancing Character, Better</span>
				<Highlight className="lua">
{`Def.Model {
	Meshes=CHARMAN:GetRandomCharacter():GetModelPath(),
	Materials=CHARMAN:GetRandomCharacter():GetModelPath(),
	Bones=CHARMAN:GetRandomCharacter():GetModelPath(),
	OnCommand=function(self)
		-- Set the model's y rotation to accommodate our vantage point
		-- and apply a z that will get the model closer to the camera.
		self:Center():rotationy(180):z(300)
	end,
}
`}
				</Highlight>

				<p><img alt="" className="img-fluid" src="/Lua-For-SM5/img/Model-Meshintro.png" /></p>


				<p>Okay, that&apos;s closer, but still doens&apos;t look like the dancing character from gameplay!</p>

				<p>There&apos;s one additional "gotcha" regarding model animations in StepMania&apos;s Dancing Characters.  They are not handled by or defined within the model itself; rather, StepMania handles it, by loading the bones from somewhere else. To add a bone to the model, simply pass the <code>Bones</code> attribute of the <code>Def.Model</code> a dedicated bones file.</p>


				<span className="CodeExample-Title">Random Dancing Character, Fixed</span>
				<Highlight className="lua">
{`Def.Model {
	Meshes=CHARMAN:GetRandomCharacter():GetModelPath(),
	Materials=CHARMAN:GetRandomCharacter():GetModelPath(),

	-- For this example, we'll provide a path to a dedicated bones file
	-- by using SM5's Character GetRestAnimationPath() method
	-- for this example, we'll use the Rest Animation
	Bones=CHARMAN:GetRandomCharacter():GetRestAnimationPath(),

	OnCommand=function(self)
		-- Set the model's y rotation to accommodate our vantage point
		-- and apply a z that will get the model closer to the camera.
		self:Center():rotationy(180):z(300)

		-- since we're using the rest animation, we'll want to also set
		-- the y() position to be lower on on the screen
		self:addy(10)
	end
}
`}
</Highlight>


			  <p><img alt="" className="img-fluid" src="/Lua-For-SM5/img/Model-WithBones.png" /></p>


			  <p>As a final note, some models may have inverted vertexes, which can cause some polygons to collide with one another and draw in the wrong order. To fix this, set the model&apos;s <code>Cull Mode</code> to <code>none</code>.</p>


				<span className="CodeExample-Title">Random Dancing Character, CullMode None</span>
				<Highlight className="lua">
{`Def.Model {
	Meshes=CHARMAN:GetRandomCharacter():GetModelPath(),
	Materials=CHARMAN:GetRandomCharacter():GetModelPath(),

	Bones=CHARMAN:GetRandomCharacter():GetRestAnimationPath(),

	OnCommand=function(self)
		-- Set the model's y rotation to accommodate our vantage point
		-- and apply a z that will get the model closer to the camera.
		self:Center():rotationy(180):z(300)

		-- since we're using the rest animation, we'll want to also set
		-- the y() position to be lower on on the screen
		self:addy(10)

		-- finally, set the Cull Mode to none
		self:cullmode("CullMode_None")
	end
}
`}
				</Highlight>
			</div>
		);
	}
}

export default Model;