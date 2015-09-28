---
layout: default
title: SCREENMAN
chapter: 2
section: 1
---

# Section 2.1 &mdash; SCREENMAN Singleton

The SCREENMAN (short for *Screen Manager*) singleton is primarily used in conjunction with its `GetTopScreen()` method to do just that – get the screen that is currently on the top of StepMania's screen stack.  (This typically means the current screen.)

SCREENMAN also has a some other methods which are worth knowing, namely `SystemMessage()`.   As we'll demonstrate below, `SystemMessage()`  can be handy for quick debugging.

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
	InitCommand=function(self)
		-- So, we queue a secondary command, and call GetTopScreen()
		-- from there.
		self:queuecommand("CaptureTopScreen")
	end,
	CaptureTopScreenCommand=function(self)
		-- When this function is called, StepMania's engine will be one
		-- frame past InitCommand.  By now, the screen we want will be ready.
		
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

Again, there are many custom methods that belong to the many different classes of screens, more than can be reasonable documented here.  For a full list, please refer to the various screen classes documented in the <a href="{{ site.baseurl }}/API/Lua.xml">SM5 Lua API</a>.  This currently includes everything from **Class Screen**:*ActorFrame* down to **Class ScreenWithMenuElementsSimple**:*ScreenWithMenuElements* (with the exception of ScreenManager itself, of course!).

### Debugging with SystemMessage()

Using ScreenMan's `SystemMessage()` method may perhaps be the most tried-and-true means of quickly displaying debugging output to the Screen.  `SystemMessage()` accepts a string as an argument and displays it at the top of the screen for a few seconds.

Let's jump into a simple example from ScreenGameplay where we listen for and print out JudgmentMessages.  A *Judgment* is how each step is evaluated as it passes in Gameplay.  Each Judgment has a corresponding JudgmentMessage broadcast by the engine that contains information about that Judgment.

<span class="CodeExample-Title">Using SystemMessage() to print debug output</span>
{% highlight lua linenos=table %}

-- Since the engine only broadcasts JudgmentMessages to ScreenGameplay,
-- this example only makes sense and does anything in ScreenGameplay.

return Actor{
	
	JudgmentMessageCommand=function(self, params)
		-- Note that JudgementMessages will be broadcast for any human players,
		-- but to keep this example simple, we'll limit it to PLAYER_1.
		if params.Player == PLAYER_1 then
			
			-- This SystemMessage will display each judgment in string
			-- form at the top of the screen as it occurs.
			-- So, if a note passes and the player misses it,
			-- "TapNoteScore_Miss"  would be displayed at the
			-- top of the screen. 
			--
			-- A W1 judgment (Marvelous in DDR, Fantastic in ITG, etc.)
			-- would display "TapNoteScore_W1".
			-- (Note that the "W" is for window, as in "timing window.") 
			SCREENMAN:SystemMessage( params.TapNoteScore )
		end
	end
}
{% endhighlight %}

### Using SystemMessage() to display Table output

`SystemMessage()` display strings, not tables, so if in our debugging endeavors we want such functionality, we'll have to enhance SystemMessage some with custom Lua.  The *Simply Love* theme for SM5 <a href="https://github.com/dguzek/Simply-Love-SM5/blob/master/Scripts/SL-Utilities.lua#L51-L72">includes some helper functions</a>.  As the author of that theme, I encourage you to use that code in your own scripting/theming endeavors.  One way to do this is to include a copy of **SL-Utilities.lua** in the *./Scripts* directory of your current theme.

The function defined in **SL-Utilities.lua** that is relevant here is `SM()`  which is short for SystemMessage.  Assuming that SL-Utilities.lua is copied into the current theme's Scripts directory and loaded (by restarting StepMania or pressing <kbd>Control F2</kbd>), this example will print table of the which steps were just judged in a JudgmentMessage.

<span class="CodeExample-Title">using SM() to display a small Lua table</span>
{% highlight lua linenos=table %}
return Actor{
	JudgmentMessageCommand=function(self, params)
	-- Again, limit to  PLAYER_1 for a more simple example.
	if params.Player == PLAYER_1 then
		-- SystemMessage a stringified table of note columns 
		-- as each judgment occurs
		SM( params.Notes )
	end
}
{% endhighlight %}

The screenshot below shows that columns 4 and 1 (a left-right jump) were just missed.

<img src="{{ site.baseurl }}/images/using-SM-to-debug-table.png">

 Please note that this debugging approach has limited usefulness as large Lua tables can easily contain more data than StepMania's window can reasonably display.  In such situations, a proper Lua `Trace()` is preferred.  Output from `Trace()` is written to *Logs/Log.txt*
 
