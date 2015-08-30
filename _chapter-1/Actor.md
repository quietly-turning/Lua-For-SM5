---
layout: default
title: Actor
chapter: 1
section: 4
---

# Section 1.4 – Actor

The *Actor* class is the most generic and lightweight StepMania Actor; all other Actors inherit from it (directly or eventually).  Using *Actor* objects directly to load an image or sound can be somewhat cumbersome; the `LoadActor()` helper function discussed later is often easier to use and more flexible.

Still, there are times when *Actor* objects can be useful.  For example, the Simply Love SM5 port uses them when we need a hook to some message broadcast by the engine but an ActorFrame isn't necessary.

See: [Simply Love/BGAnimations/ScreenOptionsService in.lua](https://github.com/dguzek/Simply-Love-SM5/blob/master/BGAnimations/ScreenOptionsService%20in.lua)

<span class="CodeExample-Title">Example using an Actor directly:</span>
{% highlight lua linenos=table %}
return Def.Actor{
	StartTransitioningCommand=function(self)
		ThemePrefs.Save()
	end
}
{% endhighlight %}