import React, { Component } from "react";
import Highlight from 'react-highlight';
import { Link } from "react-router-dom";


class Debugging extends Component {
	render() {
		return (
			<div>

			<h2>Debugging</h2>

			<p>Using <Link to="/SCREENMAN">SCREENMAN</Link>&apos;s <code>SystemMessage()</code> method may perhaps be the most tried-and-true means of quickly displaying debugging output to the Screen.  <code>SystemMessage()</code> accepts a string as an argument and displays it at the top of the screen for a few seconds.</p>

			<p>Let&apos;s jump into a simple example from ScreenGameplay where we listen for and print out JudgmentMessages.  A <em>Judgment</em> is how each step is evaluated as it passes in Gameplay.  Each Judgment has a corresponding JudgmentMessage broadcast by the engine that contains information about that Judgment.</p>

			<span className="CodeExample-Title">Using SystemMessage() to print debug output</span>
			<Highlight className="Lua">
{`
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
			--
			-- Hold notes have their own, separate judgment system.
			-- So, when a hold note is judged, a JudgmentMessage will be
			-- broadcast, but the TapNoteScore parameter will be nil.
			-- Account for that here with a logical or statement that tries
			-- params.HoldNoteScore if params.TapNoteScore is nil.
			SCREENMAN:SystemMessage( params.TapNoteScore or params.HoldNoteScore )
		end
	end
}
`}
			</Highlight>

			<h3>Using SystemMessage() to display Table output</h3>

			<p><code>SystemMessage()</code> display strings, not tables, so if in our debugging endeavors we want such functionality, we&apos;ll have to enhance SystemMessage some with custom Lua.  The <em>Simply Love</em> theme for SM5 <a href="https://github.com/dguzek/Simply-Love-SM5/blob/master/Scripts/06%20SL-Utilities.lua">includes some helper functions</a>.  As the author of that theme, I encourage you to use that code in your own scripting/theming endeavors.  One way to do this is to include a copy of <strong>SL-Utilities.lua</strong> in the <em>./Scripts</em> directory of your current theme.</p>

			<p>The function defined in <strong>SL-Utilities.lua</strong> that is relevant here is <code>SM()</code>  which is short for SystemMessage.  Assuming that SL-Utilities.lua is copied into the current theme&apos;s Scripts directory and loaded (by restarting StepMania or pressing <kbd>Control</kbd> <kbd>F2</kbd>), this example will print table of the which steps were just judged in a JudgmentMessage.</p>

			<span className="CodeExample-Title">Using SM() to display a small Lua table</span>
			<Highlight className="lua">
{`
return Actor{
	JudgmentMessageCommand=function(self, params)
		-- Again, limit to  PLAYER_1 for a more simple example.
		if params.Player == PLAYER_1 then
			-- SystemMessage a stringified table of note columns
			-- as each judgment occurs
			SM( params.Notes )
		end
	end
}
`}
			</Highlight>

			<p>The screenshot below shows that columns 4 and 1 (a left-right jump) were just missed.</p>

			<p><img src="/img/using-SM-to-debug-table.png" alt="a screenshot demonstrating how to use the SM helper function to debug a Lua table"/></p>

			<h3>Knowing when to use Trace()</h3>

			<p>Please note that <code>SystemMessage()</code> is not the only debugging tool available in StepMania.  SystemMessage() actually has a rather limited usefulness because large Lua tables can easily contain more data than StepMania&apos;s window can reasonably display.  In such situations, a proper Lua <code>Trace()</code> is preferred.  Output from <code>Trace()</code> is written to <em>Logs/Log.txt</em></p>

			<p>StepMania&apos;s <em>_fallback</em> theme includes a  <code>rec_print_table()</code> function to assist with recursively printing deeply nested Lua tables to the Log.txt file.  Here is the example from above, reworked to to use <code>rec_print_table()</code> to write the entire params table to file.</p>

			<span className="CodeExample-Title">Using rec_print_table() to log a large Lua table</span>
			<Highlight className="lua">
{`
return Actor{
	JudgmentMessageCommand=function(self, params)
	-- recursive print the entire table of JudgmentMessage parameters
	-- to Logs/Log.txt.  This would be more information than could fit
	-- onscreen at a single moment.
	rec_print_table( params )
end
}
`}
			</Highlight>

			</div>
		);
	}
}

export default Debugging;