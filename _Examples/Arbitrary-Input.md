---
layout: default
title: Capturing Arbitrary Input
chapter: 4
section: 1
---

## Section 4.1 &mdash; Capturing Arbitrary Input

Arbitrary input (from game buttons, menu buttons, coin buttons, etc.) can be detected and handled by using the `AddInputCallback()` method of any screen.


<span class="CodeExample-Title">A very simple InputCallback example:</span>
{% highlight lua linenos=table %}
local function InputHandler( event )
	-- do stuff with the event table in here
	-- the attribtues of the event tables are documented below
end

Def.ActorFrame{
	OnCommand=function(self)
		SCREENMAN:GetTopScreen():AddInputCallback( InputHandler )
	end,
}
{% endhighlight %}


This adds the lua function `InputHandler()` to the list of functions the screen will pass input to.  Whenever an input event occurs, `InputHandler()` will be passed a table with the details of the event.

<div class="panel callout radius">
Note that this method should <strong>not</strong> be used to handle text input from the user because it would not handle localization or different keyboard layouts.
</div>

The screen and your own callback function will both be passed input events, so be aware of what input the current screen responds to and consider the effects.

Details of the table containing the event data is as follows.  In the very simple example above, this table would be the `event` table that is passed into the `InputHandler()` function on *every* input event.

<span class="CodeExample-Title">An input event table:</span>
{% highlight lua linenos=table %}
{
	-- The raw details of the event.
	-- Most of the time, this will be "lower level"
	-- than anything you might want themeside.
	DeviceInput = {

		-- The type of device.  The first half of the string will be "Device_",
		-- the second half will be from InputDeviceNames in RageInputDevice.cpp.
		device = string,

		-- The button that was pressed. the first half of the string will
		-- be "DeviceButton_", the second half will be from InitNames
		-- in RageInputDevice.cpp.
		button= string,

		-- A floating point value for analog input, (ie. mouse)
		level = float,

		-- Mousewheel input.
		z = float,

		-- Whether the button is down.
		-- This is level with a threshold and debouncing applied.
		down = bool,

		-- How long ago this input occurred, in seconds.
		ago = float,

		-- True if the device is a joystick.
		is_joystick = bool,

		-- True if the device is a mouse.
		is_mouse = bool

	}, -- This ends the list of things inside the DeviceInput part of the table.

	-- The game controller this event was mapped to.
	-- "GameController_1" or "GameController_2"
	-- or nil if the event wasn't mapped to either controller.
	controller = string,

	-- The semi-raw button that was pressed.
	-- This is what the button was mapped to by
	-- the keymap settings, but without the
	-- conversions that occur when
	-- OnlyDedicatedMenuButtons is true.
	-- Will be empty if the button was not mapped.
	button = string,

	-- The type of event.  One of three possible values:
	--		"InputEventType_FirstPress"
	--		"InputEventType_Repeat"
	--		"InputEventType_Release".
	type = string,

	-- The cooked button that was pressed.
	-- This is button with mapping that occurs when
	-- OnlyDedicatedMenuButtons is true applied.
	-- This is nil for unmapped buttons.
	GameButton = string,

	-- The player that the controller is mapped to, or nil.
	PlayerNumber = PlayerNumber,

	-- Unknown purpose.  Probably related to Netplay.
	MultiPlayer = string,
}
{% endhighlight %}


Here is a well-commented example, courtesy of Kyzentun.   It consists of a few variables, an input handling function, and an ActorFrame with two BitmapText actors whose text will be set by the input handling function.

Note that this example only displays information from the *most recent* button press because new input events (first_press, repeat, release) are triggered on a per-button basis.   It is possible to maintain a list of which buttons are being held in a Lua table, but this is left as an exercise for the reader for now. :)

<span class="CodeExample-Title">Simple usage of SOUND singleton:</span>
{% highlight lua linenos=table %}
-- button_text and game_button_text will be set to actors when those actors
-- are created. These local variables exist to skip the hassle of calling
-- GetChild().
local button_text = false
local game_button_text = false

-- button_text will be used to show the button field from the input event,
-- and game_button_text will be used for the GameButton field.	These two
-- fields can be different because Stepmania has the OnlyDedicatedMenuButtons
-- preference.	That preference is intended to make it so that only the menu
-- buttons (MenuLeft, MenuRight, MenuUp, MenuDown, commonly only MenuLeft and
-- MenuRight on cabinets) can be used in menus.	 If OnlyDedicatedMenuButtons
-- is false, then Left will be translated to MenuLeft, and the GameButton
-- field will be set to MenuLeft when Left on the pad is pressed.
-- This digression about menu button translation really only matters to
-- themers trying to make a good menu control scheme.	For a simfile played
-- on a cabinet, GameButton will usually be nil, because most cabinets are
-- set not to map the pads to the menu buttons.

-- Since both text actors will have their text formatted the same way, it's
-- useful to make a wrapper function to avoid duplicating the formatting.
-- When the formatting changes, say changing spaces to colons, only
-- set_button_text needs to change.
local function set_button_text(text_actor, pn, button, press_type)
	text_actor:settext( ToEnumShortString(pn) .. " " .. button .. " " .. press_type )
end

-- Lua.xml lists all the parts of the event table.
local function InputHandler( event )
	-- If a button that is not mapped to any player is pressed, the
	-- PlayerNumber field will be nil.	Otherwise, it will be PLAYER_1 or
	-- PLAYER_2.
	if not event.PlayerNumber then return end
	-- The delay between FirstPress and Repeat is set by the RepeatDelay
	-- metric for the screen.
	-- The number of repeats per second is set by the RepeatRate metric.
	local press_type= ToEnumShortString(event.type)
	set_button_text(button_text, event.PlayerNumber, event.button, press_type)
	set_button_text(game_button_text, event.PlayerNumber, event.GameButton, press_type)
end

return Def.ActorFrame{
	-- We add a sleeper actor so this can be used in a BGCHANGE lua
	-- file and the file won't be unloaded.	This isn't necessary when
	-- making a screen in a theme.
	Def.Actor{
		InitCommand=function(self)
			self:hibernate(1000)
		end
	},


	-- AddInputCallback cannot be in an InitCommand. InitCommands happen
	-- before the screen is the top screen, so calling GetTopScreen during an
	-- InitCommand would fetch the screen being transitioned out of that
	-- is about to be destroyed.
	OnCommand=function(self)
		SCREENMAN:GetTopScreen():AddInputCallback( InputHandler )
	end,

	Def.BitmapText{
		Font="Common Normal",
		InitCommand=function(self)

			-- Since button_text is set inside an InitCommand, it occurs before the
			-- OnCommand that adds the input callback, so the input callback
			-- doesn't need to worry about whether button_text is initialized.
			button_text = self

			-- Lua is whitespace insensitive, so sticking a line break before a
			-- colon in the middle of a chain of functions is valid.
			self:xy(_screen.cx, _screen.cy-12)
				-- Colors are just tables of four numbers. Using html
				-- strings and the color function would also work.
				:DiffuseAndStroke({.75, .75, 0, 1}, {0, 0, 0, 1})
		end
	},

	Def.BitmapText{
		Font="Common Normal",
		InitCommand= function(self)
			game_button_text = self
			self:xy(_screen.cx, _screen.cy+12)
				:DiffuseAndStroke({.75, 0, .75, 1}, {0, 0, 0, 1})
		end
	},
}
{% endhighlight %}