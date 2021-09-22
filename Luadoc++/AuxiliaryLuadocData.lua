-- ------------------------------------------
-- generate an auxiliary json file that can enhance the Lua API docs

-- StepMania objects to inspect for theme-side function defs
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
-- ugly
-- TODO: find a Lua library for JSON output

local function_definitions = function()

   local first_section_done = false
   local json = "{"

   for section, obj in pairs(sm_objs) do
      if first_section_done then json = json.."," end
      first_section_done = true

      json = json .. ("\n\t\"%s\": {"):format(section)

      local first_func_done = false

      for k,v in pairs(obj) do
         if type(v)=="function" then
            local info = debug.getinfo(v)

            -- skip functions definined in-engine; line numbers aren't available via debug.getinfo
            if info.short_src ~= "[C]" then
               if first_func_done then json = json.."," end
               first_func_done = true

               local url = URLEncode( ("%s#L%s-L%s"):format(info.short_src, info.linedefined, info.lastlinedefined) )
               json = json .. ("\n\t\t\"%s\": \"%s\""):format( k, url )
            end
         end
      end
      json = json .. "\n\t}"
   end

   json = json .. "\n}"

   -- return json data as string
   return json
end
-- ------------------------------------------

local theme = THEME:GetCurrentThemeDirectory()
local file  = RageFileUtil.CreateRageFile()
local path  = theme .. "FunctionDefs.json"

if file:Open(path, 2) then
   file:Write( function_definitions() )

else
   local fError = file:GetError()
   SCREENMAN:SystemMessage("uh oh.")
   Trace( "[FileUtils] Error writing to ".. path ..": ".. fError )
   file:ClearError()
end

file:destroy()
-- ------------------------------------------
