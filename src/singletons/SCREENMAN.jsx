import React, { Component } from "react";
import Highlight from 'react-highlight';
import { Link } from "react-router-dom";


class SCREENMAN extends Component {
	render() {
		return (
			<div>
			<h1>SCREENMAN Singleton</h1>

			<p>The SCREENMAN (short for <em>Screen Manager</em>) singleton is primarily used in conjunction with its <code>GetTopScreen()</code> method to do just that – get the screen that is currently on the top of StepMania&apos;s screen stack.  (This typically means the current screen.)</p>

			<p>SCREENMAN also has a some other methods which are worth knowing, namely <code>SystemMessage()</code>.   As we&apos;ll demonstrate in <Link to="/Debugging">the chapter on Debugging</Link>, <code>SystemMessage()</code>  can be handy for quick debugging.</p>

			<h3>GetTopScreen()</h3>

			<p>Within the context of theming and simfile scripting, calling <code>SCREENMAN:GetTopScreen()</code> will return the screen currently being displayed in the form of a <em>screen</em> object.
			 For example, calling it on ScreenGameplay will get you the gameplay screen in the form of a screen object.  Calling it on ScreenPlayerOptions wil do similarly but return the player options screen.</p>

			<p>While there are some methods available to <em>all</em> <Link to="/API/Lua.xml#Screen">screen objects</Link> (like <code>AddInputCallback()</code> which is covered in <Link to="/Arbitrary-Input">Handling Arbitrary Input</Link>), there are many more that depend on the class of the current Screen.  A screen object of class <em>ScreenGameplay</em> will have the method <code>GetLifeMeter()</code> which returns a <Link to="/API/Lua.xml#LifeMeter">LifeMeter</Link> object.  A screen object of class <em>ScreenSelectMusic</em> will have the method <code>GetMusicWheel()</code> which returns a <Link to="/API/Lua.xml#MusicWheel">MusicWheel</Link> ojbect.</p>

			<p>Here is a small example that uses <code>GetTopScreen()</code> on ScreenSelectMusic to get a Lua reference to the MusicWheel and change the current sort of that MusicWheel.  In order for this code to work, it must be called from a theme&apos;s ScreenSelectMusic.</p>

			<span className="CodeExample-Title">Using SCREENMAN:GetTopScreen() to get ScreenSelectMusic</span>
			<Highlight className="lua">
{`
return Actor{

	-- InitCommand happens before the screen we want is the TopScreen,
	-- so calling GetTopScreen() during an InitCommand would fetch the
	-- screen being transitioned out of that is about to be destroyed.
	-- It WILL be ready by the time OnCommand is called, however.
	OnCommand=function(self)

		-- Since this Lua is being called on ScreenSelectMusic
		-- the topscreen variable will be a screen object of ScreenSelectMusic.
		local topscreen = SCREENMAN:GetTopScreen()

		-- Get a Lua reference to the engine's MusicWheel
		-- This is a Lua object of type "MusicWheel"
		local MusicWheel = topscreen:GetMusicWheel()

		-- Change the current sort of the MusicWheel.
		-- Fot a full list of available sorts, check the SortOrder enum
		-- as documented in the Lua API.
		MusicWheel:ChangeSort("SortOrder_Artist")
	end
}
`}


			</Highlight>

			<p>Again, there are many custom methods that belong to the many different classes of screens, more than can be reasonably documented here.  For a full list, please refer to the various screen classes documented in the <Link to="/API/Lua.xml">SM5 Lua API</Link>.  This currently includes everything from <strong>Class Screen</strong>:<em>ActorFrame</em> down to <strong>Class ScreenWithMenuElementsSimple</strong>:<em>ScreenWithMenuElements</em> (with the exception of ScreenManager itself, of course!).</p>
			</div>
		);
	}
}

export default SCREENMAN;