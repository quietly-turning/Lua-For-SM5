---
layout: default
title: SCREENMAN
chapter: 2
section: 1
description: secure a handle onto the current screen object
---

# Section 2.1 &mdash; SCREENMAN Singleton

The SCREENMAN (short for *Screen Manager*) singleton is primarily used in conjunction with its `GetTopScreen()` method to do just that – get the screen that is currently on the top of StepMania's screen stack.  (This typically means the current screen.)

SCREENMAN also has a some other methods which are worth knowing, namely `SystemMessage()`.   As we'll demonstrate in <a href="{{site.baseurl}}/Examples/Debugging.html">Chapter 3.1</a>, `SystemMessage()`  can be handy for quick debugging.

### GetTopScreen()

Within the context of theming and simfile scripting, calling `SCREENMAN:GetTopScreen()` will typically return screen currently being displayed in the form of a *screen* object.
 For example, calling it on ScreenGameplay will get you the gameplay screen in the form of a screen object.  Calling it on ScreenPlayerOptions wil do similarly but return the player options screen.

While there are some methods available to *all* <a href="{{site.baseurl}}/API/Lua.xml#Screen">screen objects</a> (like `AddInputCallback()` which is covered in <a href="{{site.baseurl}}/Examples/Arbitrary-Input.html">Chapter 4.1</a>), there are many more that depend on the class of the current Screen.  A screen object of class *ScreenGameplay* will have the method `GetLifeMeter()` which returns a <a href="{{ site.baseurl }}/API/Lua.xml#LifeMeter">LifeMeter</a> object.  A screen object of class *ScreenSelectMusic* will have the method `GetMusicWheel()` which returns a <a href="{{ site.baseurl }}/API/Lua.xml#MusicWheel">MusicWheel</a> ojbect.

Here is a small example that uses `GetTopScreen()` on ScreenSelectMusic to get a Lua reference to the MusicWheel and change the current sort of that MusicWheel.  In order for this code to work, it must be called from a theme's ScreenSelectMusic.

<span class="CodeExample-Title">Using SCREENMAN:GetTopScreen() to get ScreenSelectMusic</span>
{% highlight lua linenos=table %}
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
{% endhighlight %}

Again, there are many custom methods that belong to the many different classes of screens, more than can be reasonably documented here.  For a full list, please refer to the various screen classes documented in the <a href="{{ site.baseurl }}/API/Lua.xml">SM5 Lua API</a>.  This currently includes everything from **Class Screen**:*ActorFrame* down to **Class ScreenWithMenuElementsSimple**:*ScreenWithMenuElements* (with the exception of ScreenManager itself, of course!).