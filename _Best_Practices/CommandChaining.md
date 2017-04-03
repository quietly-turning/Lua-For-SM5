---
layout: default
title: Command Chaining
section: 2
description: chain actor commands to save keystrokes
---

# Section 3.2 &mdash; Command-Chaining

In StepMania 5, commands applied to actors can be chained, resulting in a more clean and terse syntax than was possible before.

The following two syntaxes produce the same results:

<span class="CodeExample-Title">Long Form</span>
{% highlight lua linenos=table %}
Def.Quad{
	OnCommand=function(self)
		self:zoomto(100,200)
		self:xy(_screen.cx, 100)
		self:diffuse(Color.Green)
		self:linear(1)
		self:y(_screen.h-100)
	end
}
{% endhighlight %}

<span class="CodeExample-Title">Condensed Via Command Chaining</span>
{% highlight lua linenos=table %}
Def.Quad{
	OnCommand=function(self)
		self:zoomto(100,200):xy(_screen.cx, 100):diffuse(Color.Green)
			:linear(1):y(_screen.h-100)
	end
}
{% endhighlight %}

 While commands *can* be chained ad infinitum, an appropriate rule of thumb is to chain contextually-related commands together, and start a new line when a new context arises.  For example, consider starting with a tween command and then successively chaining the commands that are to be tweened.