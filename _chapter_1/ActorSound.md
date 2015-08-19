---
layout: default
title: ActorSound
chapter: 1
section: 5
---

# Section 1.5 - ActorSound

An ActorSound can be used to load and play sound files.  It supports panning between the left/right stereo channels and is intended for single-use sound effects (*not* music samples that need to be looped).

ActorSound actors have three unique attributes: `SupportPan`, `SupportRateChanging`, and `IsAction`

+ **SupportPan**
	Set this to `true` if you intend to use the `playforplayer()` method with this ActorSound.

+ **SupportRateChanging**
	Set this to `true` if you intend to manipulate the pitch and/or speed of the underlying RageSound.

+ **IsAction**
	Set this to `true` if you are want this ActorSound to be muted as a *theme action* via **F3**+**A**.  This can be useful to keep themers sane while they are repeatedly debugging a single screen over and over again.


**Example:**
{% highlight lua linenos=table %}
-- this ActorSound will play the current theme's common
-- start sound first for PLAYER_1, then wait two seconds,
-- and then play it for PLAYER_2

Def.ActorSound{
	File=THEME:GetPathS("common", "start",
	Name="Start_SFX",

	SupportPan=true,
	SupportRateChanging=true,
	IsAction=false,

	OnCommand=function(self)
		self:playforplayer(PLAYER_1)
		self:queuecommand("PlayAgain")
	end,
	PlayAgainCommand=function(self)
		self:sleep(2)
		self:playforplayer(PLAYER_2)
	end
}
{% endhighlight %}



If you need to play an audio file that you want to be cleanly looped, you'll have better luck using the `SOUND:PlayMusicPart()` singleton method.