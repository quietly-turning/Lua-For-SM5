import React, { Component } from "react";
import Highlight from 'react-highlight';
import { Link } from "react-router-dom";


class SOUND extends Component {
	render() {
		return (
			<div>
			<h1>SOUND Singleton</h1>

			<p>The SOUND singleton can be used to play audio files from a theme or simfile and has some capabilities that a <Link to="/Def.Sound">Sound actor</Link> lacks.</p>

			<h3>SOUND can be used to loop audio files cleanly</h3>

			<p>Namely, SOUND can be used to easily and cleanly loop audio files via the <code>PlayMusicPart()</code> method.  Additionally, SOUND has some helpful methods like <code>DimMusic()</code> and <code>StopMusic()</code> that might make it especially interesting from the perspective of a simfile mini-game.</p>

			<p>Here is a simple example that could be called from within a simfile&apos;s BGCHANGE or FGCHANGE script.  It assumes that there is a file <em>love-is-war.ogg</em> located in the root of the song directory.  This example uses <code>PlayMusicPart()</code> which accepts eight arguments:</p>

			<ul>
				<li><strong>music_path</strong> (string) – the path to the audio file you want to load</li>
				<li><strong>music_start</strong> (float) – how many seconds into the file you want playback to start</li>
				<li><strong>music_length</strong> (float) – how many seconds of the file you want to play</li>
				<li><strong>fade_in</strong> (float) – how many seconds should the file fade in over</li>
				<li><strong>fade_out</strong> (float) – how many seconds should the file fade out over</li>
				<li><strong>loop</strong> (boolean) – set to <code>true</code> if you want the audio file to loop until told to stop</li>
				<li><strong>apply_rate</strong> (boolean) – should this audio file follow the engine&apos;s internal sense of music rate?</li>
				<li><strong>align_beat</strong> (boolean) – if <code>true</code> or <code>nil</code>, the playback duration is automatically adjusted to cover an integer number of beats</li>
			</ul>

			<span className="CodeExample-Title">Simple usage of SOUND singleton:</span>
			<Highlight className="lua">
{`
	return Def.Actor{
	Name="BGM",
	OnCommand=function(self, params)
		local directory = GAMESTATE:GetCurrentSong():GetSongDir()
		local path = directory .. "love-is-war.ogg"

		-- love-is-war.ogg is 4 minutes and 10 seconds in duration.
		-- We want it to loop.
		SOUND:PlayMusicPart(path, 0, 250.4, 0, 0, true, true, true)

		-- Wait 10 seconds, then queue a command where we'll
		-- lower the playback volume
		self:sleep(10):queuecommand("LowerPlaybackVolume")
	end,
	LowerPlaybackVolumeCommand=function(self)

		-- Lower the volume to 33% for a duration of 10 seconds.
		SOUND:DimMusic(0.33, 10)
	end,
	OffCommand=function(self)

		-- We don't want this audio to continue playing past
		-- ScreenGameplay, so, when this actor's OffCommand
		-- is triggered, stop the SOUND singleton.
		SOUND:StopMusic()
	end
}
`}
			</Highlight>

			<h3>SOUND or Def.Sound&#123;&#125; ?</h3>

			<p>Of course, the SOUND singleton lacks some of the special features that a <Link to="Def.Sound">Sound actor</Link> possesses.</p>

			<p>Only one sound can be played via SOUND at any given moment, while there can be multiple <em>Sound</em> actors loaded simultaneously.  Furthermore, SOUND has no control over playback pitch or stereo panning.  Thus, both the SOUND singleton and <em>Sound</em> actors have unique and valid use cases.</p>
			</div>
		);
	}
}

export default SOUND;