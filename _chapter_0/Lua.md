---
layout: default
title: Lua
chapter: 0
section: 2
---

# Section 0.2

## Differences between Lua 5.0 and Lua 5.1

SM3.95 used [Lua 5.0](http://www.lua.org/versions.html\#5.0), while SM5 currently uses [Lua 5.1](http://www.lua.org/versions.html\#5.1).
The primary differences that will likely impact your scripting experience are:

### Modulus Operator as %
Lua 5.0 required `math.mod()` to perform modulo operations, while Lua 5.1 introduced a proper modulus operator.

{% highlight Lua linenos=table %}
local teamdragonforce = 3 % 2
print(teamdragonforce)
-- output: 1
{% endhighlight %}

### Table Size Operator as &#35;
Lua 5.0 required the  `table.getn()` function to determine the size of an indexed table, while Lua 5.1 introduced a simple operator for this common task.

{% highlight Lua linenos=table %}
-- this table is indexed, so the # operator works
local StomperZ = { "fast", "brutal", "bearlike" }
print(#StomperZ)
-- output: 3

-- this table is key/value, so the # operator does NOT work
local NotIndexed ={
	blah = "fast",
	nah = "brutal",
	whatever = "bearlike"
}
print(#NotIndexed)
-- output: 0
{% endhighlight %}

### Simple For Loop Deprecation
For the official explanation, read <http://www.luafaq.org/#T1.13>
