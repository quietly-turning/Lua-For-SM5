-- ------------------------------------------
-- generate an auxiliary json file that can enhance the Lua API docs
--
-- for an example of the json file this ITGmania theme generates
-- see: https://github.com/quietly-turning/Lua-For-SM5/blob/src/public/Luadoc%2B%2B/ITGmania/v1.0.2.json

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