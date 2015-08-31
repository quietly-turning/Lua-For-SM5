---
layout: default
title: SOUND
chapter: 2
section: 2
---

# Section 2.2 &mdash; SOUND Singleton

The SOUND singleton can be used to play audio files from a theme or simfile and has some capabilities that <a href="{{site.baseurl}}/chapter-1/ActorSound.html">ActorSound</a> lacks.

### SOUND can be used to loop audio files cleanly
Namely, SOUND can be used to easily and cleanly loop audio files via the `PlayMusicPart()` method.  Additionally, SOUND has some helpful methods like `DimMusic()` and `StopMusic()` that make it especially interesting from the perspective of a simfile mini-game.

Here's a simple example that could be called from within a simfile's BGCHANGE or FGCHANGE script.  It assumes that there is a file *love-is-war.ogg* located in the root of the song directory.  This example uses `PlayMusicPart()` which accepts eight arguments:

+ **music_path** (string) – the path to the audio file you want to load
+ **music_start** (float) – how many seconds into the file you want playback to start
+ **music_length** (float) – how many seconds of the file you want to play
+ **fade_in** (float) – how many seconds should the file fade in over
+ **fade_out** (float) – how many seconds should the file fade out over
+ **loop** (boolean) – set to *true* if you want the audio file to loop until told to stop
+ **apply_rate** (boolean) – should this audio file follow the engine's internal sense of music rate?
+ **align_beat** (boolean) – if `true` or `nil`, the playback duration is automatically adjusted to cover an integer number of beats

<span class="CodeExample-Title">Simple usage of SOUND singleton:</span>
{% highlight lua linenos=table %}
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
{% endhighlight %}


### SOUND or Def.ActorSound{} ?
Of course, the SOUND singleton lacks some of the special features that an <a href="{{site.baseurl}}/chapter-1/ActorSound.html">ActorSound</a> possesses.

Only one sound can be played via SOUND at any given moment, while there can be multiple ActorSounds loaded simultaneously.  Furthermore, SOUND has no control over playback pitch or stereo panning.  Thus, both SOUND and ActorSound have unique and valid use cases.