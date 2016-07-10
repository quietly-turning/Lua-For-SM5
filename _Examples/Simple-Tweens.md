---
layout: default
title: Simple Tweens
section: 2
description: animate things from one state to another
---

# Section 4.2 &mdash; Simple Tweens

A <em>tween</em> is a process in computer animation in which an object is manipulated (translated, transformed, altered, etc.) from a starting state to an ending state.  StepMania has several simple tweens that can be used to animate virtually any aspect of StepMania's visual interface.

As a Lua scripter, you can use tweens for any number of tasks, including (but not limited to):

* make a Quad actor grow to be twice as large by tweening its `zoom()` value to 2
* make the entire screen appear to "fade out" by tweening its `diffuse()` to <em>Color.Black</em>
* gradually fade out an image Actor by tweening its `diffusealpha()` to 0
* moving the Player's receptor arrows somewhere else on the screen by tweening the `x()` and `y()` values
* etc.

This tutorial will cover <em>types of simple tweens</em> available in StepMania, discuss <em>how to use tweens</em>, and concludes with a full example.

## Tweens Defined by the Engine
The StepMania engine defines four simple tweens directly: <em>linear</em>, <em>accelerate</em>, <em>decelerate</em>, and <em>spring</em>.  

* `linear()` - Execute following commands steadily, at a constant rate.
* `accelerate()` - Starts slow and progressively speeds up.
* `decelerate()` - Starts fast and progressively slows down.
* `spring()` - Rapidly shoots beyond the desired end state, then springs back into place.

For completion's sake, it is worth noting here that `sleep()` is also a tween, even though most Lua scripters working with StepMania don't think of it as such.  `sleep()` will wait for the specified duration, then execute all following commands at once.

## Tweens Defined by the <em>_fallback</em> theme
The engine also defines a fifth tween type, <em>bezier</em>, which allows scripters to custom define more complex tweens.  Indeed, the <em>_fallback</em> theme uses the `bezier()` tween type to predefine a few extra tweens for us that are simple to use.

* `smooth()` - Slow to start, fast in the middle, slow to finish.
* `bouncebegin()` - Briefly inverts the tween at first, giving the appearance of bouncing to start.
* `bounceend()` - Briefly inverts the tween at the end, giving the appearance of bouncing to end.
* `drop()` - Slows as it approaches its end state, then briefly accelerates the final few frames.

If you are interested in learning more about `bezier()` tweens, you can inspect <strong><a href="https://github.com/stepmania/stepmania/blob/master/Themes/_fallback/Scripts/02%20Actor.lua">02 Actor.lua</a></strong> in the _fallback theme's Scripts directory to see how <em>smooth</em>, <em>bouncebegin</em>, <em>bounceend</em>, and <em>drop</em> are defined in Lua.

## How to Use Tweens

Knowing <em>what</em> we can use is great, but it's only half the picture.  If you apply a tween to an Actor without any further commands, it won't <em>do</em> anything.  Tweens need additional commands to execute over the course of their duration in order to animate in any meaningful way.

Let's illustrate what we mean by this with some examples.


<span class="CodeExample-Title">Tween a quad to become twice as large:</span>
{% highlight lua linenos=table %}
Def.Quad{
	OnCommand=function(self)
		-- draw a Quad in center of the screen, make it 100x100 pixels,
		-- and make it red
		self:Center():zoomto(100,100):diffuse(1,0,0,1)
		
		-- over a duration of 3 seconds, have the
		-- quad zoom to be twice its initial size
		self:linear(3):zoom(2)
	end
}
{% endhighlight %}


The next example is somewhat more fun in that it appears to spin the entire screen around, but it also illustrates a  "gotcha" with tweening that you should be aware of.

<span class="CodeExample-Title">Rotate the entire Screen on the z-axis:</span>
{% highlight lua linenos=table %}
Def.ActorFrame{
	OnCommand=function(self)
		-- get the current Screen object using SCREENMAN
		local screen = SCREENMAN:GetTopScreen()
		
		-- over a duration of 2 seconds, have
		-- the entire screen rotate 360 degrees
		-- clockwise on the z-axis
		screen:accelerate(2):rotationz(360)
		
		-- wait one second
		screen:sleep(1)
		
		-- This should spin the screen around again, right?
		-- Not quite. The screen's z-rotation is already set
		-- to 360, so this will have no visible effect.
		screen:accelerate(2):rotationz(360)
		
		-- This, however, will because it adds more rotation
		-- to the current state, rather than the initial state.
		screen:accelerate(2):addrotationz(360)
	end
}
{% endhighlight %}

Can you tween more than one property of an actor at once?  Absolutely.

The next example demonstrates that <em>all</em> commands following a tween will be tweened, until the next tween command is encountered of course.

<span class="CodeExample-Title">Move a quad across the screen while fading it out:</span>
{% highlight lua linenos=table %}
Def.Quad{
	OnCommand=function(self)
		-- draw a Quad at the top-left of the screen, which is the
		-- default draw position if no x or y coordinates are specified,
		-- and make it 100x100 pixels
		self:zoomto(100,100)
		
		-- over a duration of 2 seconds, have the
		-- quad move to the bottom-right of the screen,
		-- and fade out by tweening the alpha channel to 0
		-- This comprises one full tween.
		self:decelerate(2):xy( _screen.w, _screen.h ):diffusealpha(0)
		
		-- Here is a second, unique tween.  Note that line breaks are fine.
		self:accelerate(3)
			:diffuse(1,0,0,1)
			:xy( _screen.cx, _screen.cy )
			:addrotationy(1080)
		
	end
}
{% endhighlight %}

## Tweens in Motion

Reading about tweens is well and good, but seeing is believing.  I've put together a scripted simfile that briefly demonstrates each of these tweens, one after another.

You can download that here!   <a href="{{site.baseurl}}/downloads/Simple-Tweens.zip">Simple-Tweens.zip</a>
