-- ------------------------------------------
-- author:  quietly-turning
-- GitHub:  https://github.com/quietly-turning/Lua-For-SM5
--
-- purpose: Generates a json file to enhance the online Lua API docs at
--          https://quietly-turning.github.io/Lua-For-SM5/LuaAPI
--          by providing URLs to ITGmania's GitHub, linking readers the exact line-number
--          where each Global Function in the _fallback theme is defined.
--
-- notes:   This file uses `JsonEncode()`, added to ITGmania, to write a json file to disk.
--          `JsonEncode()` is not available in vanilla SM5, and may not be available in
--           analogous forks of SM5, but it should be easy to replace with any generic library
--           that serializes a JSON string from a Lua table.
--
-- usage:   Move this theme folder (ThemeToExportLuaInfo) into ./ITGmania/Themes
--          then use ITGmania's operator menu to switch to this theme.
--          When this theme reaches ScreenInit (this file), it will write a file to disk like
--             ./ITGmania/Themes/ThemeToExportLuaInfo/v1.1.0.json
--          which you can move to
--             ./Lua-For-SM5/public/Luadoc++/ITGmania/v1.1.0.json
--
--          When switching from one theme (e.g. Simply Love) to another (e.g. ThemeToExportLuaInfo)
--          Global Variables created by the 1st theme will carry over into the 2nd theme and, in
--          this case, be written to disk in the json file.
--
--          My own approach with the Lua-For-SM5 project has been to *only* document functions available
--          to every ITGmania theme, meaning I don't want to document functions specific to Simply Love.
--
--          This requires an export-workflow like:
--          1.  Start ITGmania.  It starts up with your normal theme, which has its own global functions.
--          2.  Use the operator menu to switch to ThemeToExportLuaInfo.
--              A json file is written to disk with global variables from both themes.  Ignore it.  It
--              will be overwritten in a moment.
--          3.  Quit ITGmania.
--          4.  Start ITGmania.  This time, it will start up with ThemeToExportLuaInfo, which contains
--              no global variables of its own.  A json file is written to disk with global variables from
--              _fallback.
--          5.  Move the new json file to your Lua-For-SM5 project.
--          6.  Use the operator menu to switch back to your normal theme.
--
--
-- for an example of the json file this ITGmania theme generates
-- see: https://github.com/quietly-turning/Lua-For-SM5/blob/src/public/Luadoc%2B%2B/ITGmania/v1.0.2.json

-- ------------------------------------------
-- ITGmania objects to inspect for theme-side function defs
-- hardcoded keys for now (how to traverse Def userdata?)
local sm_objs = {
   ["GlobalFunctions"]   = _G,
   ["Actor"]             = Actor,
   ["ActorFrame"]        = ActorFrame,
   ["ActorSound"]        = ActorSound,
   ["Sprite"]            = Sprite,
   ["BitmapText"]        = BitmapText,
   ["HelpDisplay"]       = HelpDisplay,
   ["Sound"]             = Sound,
   ["Song"]              = Song,
   ["GameState"]         = GameState,
   ["ThemeManager"]      = ThemeManager,
   ["ScreenSelectMusic"] = ScreenSelectMusic,
   ["Screen"]            = Screen,
}

-- ------------------------------------------

local function_definitions = function()

   local luadoc = {}

   for section, obj in pairs(sm_objs) do
      local functionDefURLs = {}

      for k,v in pairs(obj) do
         if type(v)=="function" then
            local info = debug.getinfo(v)

            -- skip functions defined in-engine; line numbers aren't available via debug.getinfo
            if info.short_src ~= "[C]" then
               -- build a URL-safe string like "/Themes/_fallback/Scripts/02%20Actor.lua#L202-L206"
               -- that can show users where Actor's scale_or_crop_background() is defined in the _fallback theme
               local url = URLEncode( ("%s#L%s-L%s"):format(info.short_src, info.linedefined, info.lastlinedefined) )
               -- add each url to a table for this singleton
               functionDefURLs[k] = url
            end
         end
      end

      -- add each singleton's collection of urls linking to function definitions to the larger table of singletons
      luadoc[section] = functionDefURLs
   end

   -- return a Lua table
   return luadoc
end
-- ------------------------------------------

local theme = THEME:GetCurrentThemeDirectory()
local file  = RageFileUtil.CreateRageFile()
local path  = theme .. "v" .. ProductVersion() .. ".json"

if file:Open(path, 2) then
   -- serialize the lua object into a json string we can write to disk
   local json = JsonEncode( function_definitions() )
   file:Write( json )

else
   local fError = file:GetError()
   SCREENMAN:SystemMessage("Error writing Luadoc info to json file.  Check log.txt for more details.")
   Trace( "[FileUtils] Error writing to ".. path ..": ".. fError )
   file:ClearError()
end

file:destroy()
-- ------------------------------------------

return Def.Actor{}