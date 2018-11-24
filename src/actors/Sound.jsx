import React, { Component } from "react";
import Highlight from 'react-highlight';
import { Link } from "react-router-dom";


class Sound extends Component {
	render() {
		return (
			<div>

			<h1>Sound</h1>

			<p>A <em>Sound</em> actor can be used to load and play sound files.  It supports panning between the left/right stereo channels and is intended for single-use sound effects.</p>

			<p className="alert alert-warning">
			If you need to play an audio file that you want to be cleanly <strong>looped</strong>, you&#8217;ll have better luck using the <code>SOUND:PlayMusicPart()</code> singleton method which is documented in <Link to="SOUND">SOUND</Link>.
			</p>

			<span className="CodeExample-Title">Minimal Example:</span>
			<Highlight className="lua">
{`
Def.Sound{
	-- Note that you must tell the sound actor to play().
	File="filepath.ogg",

	OnCommand=function(self)
		self:play()
	end,
}


			<p><em>Sound</em> actors have three unique attributes: <code>SupportPan</code>, <code>SupportRateChanging</code>, and <code>IsAction</code></p>

			<ul>
				<li>
					<p>
						<strong>SupportPan</strong> Set this to <code>true</code> if you intend to have the sound played solely through the left (for <code>PLAYER_1</code>) or the right (for <code>PLAYER_2</code>) audio channel.  This is accomplished with the <code>playforplayer()</code> method.
					</p>
				</li>

				<li>
					<p>
						<strong>SupportRateChanging</strong> Set this to <code>true</code> if you intend to manipulate the pitch and/or speed of the underlying RageSound.
					</p>
				</li>
				<li>
					<p>
						<strong>IsAction</strong> Set this to <code>true</code> if you are want this Sound actor to be muted as a <em>theme action</em> via <kbd>F3</kbd>+<kbd>A</kbd>.  This can be useful to keep themers sane while they are repeatedly debugging a single screen over and over again.
					</p>
				</li>
			</ul>

			<span className="CodeExample-Title">SupportPan Example:</span>
			<Highlight className="lua">
{`
-- this Sound actor will play the current theme's
-- "common start" sound first for PLAYER_1, then
-- wait two seconds, and then play it for PLAYER_2

Def.Sound{
	File=THEME:GetPathS("common", "start"),
	Name="SFX_With_Pan",

	SupportPan=true,
	SupportRateChanging=true,
	IsAction=false,

	OnCommand=function(self)
		-- play the sound out of the left channel
		self:playforplayer(PLAYER_1)
		self:queuecommand("PlayAgain")
	end,
	PlayAgainCommand=function(self)
		self:sleep(2)

		-- play the sound out of the right channel
		self:playforplayer(PLAYER_2)
	end
}
`}

			</Highlight>


			<span className="CodeExample-Title">SupportRateChanging Example:</span>
			<Highlight className="lua">
{`
-- variables local to this file
local ragesound_file
local current_pitch = 1

-- this Sound actor will play the same audio file
-- three times sequentially, each time with a higher pitch
Def.Sound{
	File=THEME:GetPathS("common", "start"),
	Name="SFX_With_Pitch",
	SupportRateChanging=true,

	OnCommand=function(self)
		self:queuecommand("Play")
	end,
	PlayCommand=function(self)

		-- get the underlying sound file data
		ragesound_file = self:get()

		-- RageSound:pitch() take a float where
		-- 1.0 is "normal", 2.0 is twice as high as normal, etc.
		ragesound_file:pitch( current_pitch )

		-- play the sound file using both stereo channels
		self:play()

		-- increment current_pitch
		current_pitch = current_pitch + 1

		-- prevent infinite looping
		if current_pitch < 4 then
			-- sleep for two seconds and do it again
			self:sleep(2):queuecommand("Play")
		end
	end
}
`}
			</Highlight>


			</div>
		);
	}
}

export default Sound;