# Chapter 2 – Actors

> "All the world's a stage"
> William Shakespeare

## Section 2.1 – Quads

*Quad* Actors haven't changed notably since SM3.95.  They are programmatically
drawn *quad*rilaterals that can have properties like size, position, and color.

Since Quads are fairly simple, we'll also use this example to demonstrate a
few new-to-SM5 features and shortcuts.

```lua
-- let's assume this file is being called via FGCHANGES from a simfile.
-- Like in SM3.95, Actors from FGCHANGES disappear immediately unless
-- they, or their parent ActorFrame, are slept for some length of time.
return Def.ActorFrame{
	-- the OnCommand here applies to the primary ActorFrame
	OnCommand=cmd(sleep,9999),

	-- a red quad that accelerates from offscreen-left to offscreen-right
	-- this makes use of the \_screen and Color aliases
	Def.Quad{
		Name="RedQuad",
		InitCommand=cmd(zoomto,100,100; diffuse, Color.Red),
		OnCommand=cmd(xy, -100, _screen.cy;  accelerate, 2; x, _screen.w + 100)
	},

	-- a blue quad that decelerates from offscreen-top to offscreen-bottom
	-- this makes use of the xy() command, which is new to SM5
	-- as well as command-chaining (read more on the next page!)
	Def.Quad{
		Name="BlueQuad",
		InitCommand=cmd(zoomto,100,100; diffuse, Color.Blue),
		OnCommand=function(self)
			self:xy( _screen.cx, -100)
			self:decelerate(2):y(_screen.h + 100)
			self:queuecommand( "TriggerSpin" )
		end,
		TriggerSpinCommand=function(self)
			self:GetChild("GreenQuad"):queuecommand("Spin")
		end
	},

	-- a green quad that waits for the two quads above to finish tweening,
	-- then grows out of the center of the screen while spinning
	-- this makes use of the Center() command, which is new to SM5
	Def.Quad{
		Name="GreenQuad",
		InitCommand=cmd(zoomto,0,0; diffuse, Color.Green),
		SpinCommand=function(self)
			self:Center()
			self:effectmagnitude(0,0,1):spin()
			self:linear(5):effectmagnitude(0,0,10):zoomto(_screen.w, _screen.w)
		endx
	}
}
```

There are three things worth pointing out here.

First, this example features three unique Quads acting independently within a
single ActorFrame.  Because StepMania expects one actor to be returned per
file, we return the primary ActorFrame, which includes the Quads inside.

Second, this example also uses a few helper tables defined in SM5's *_fallback* theme such as the
`Color` table and the `_screen` table which are defined in [02 Colors.lua](https://github.com/stepmania/stepmania/blob/master/Themes/_fallback/Scripts/02\%20Colors.lua)  and [01 alias.lua](https://github.com/stepmania/stepmania/blob/master/Themes/_fallback/Scripts/01\%20alias.lua) respectively

Finally, this example introduces a new way to apply multiple commands to the
same Actor via **command chaining**.  We see this in the example above on
lines 24, 40, and 41.

 While commands *can* be chained ad infinitum, an appropriate rule of thumb is
 to chain contextually-related commands together, and start a new line when a
 new context arises.  For example, consider starting with a tween command and
 hen successively chaining the commands that are to be tweened.