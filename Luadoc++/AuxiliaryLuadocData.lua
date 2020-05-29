-- ------------------------------------------
-- generate auxiliary csv files that can enhance the Lua API docs

-- ------------------------------------------
local global_functions = function()
   local s = ""

   for k,v in pairs(_G) do
      if type(v)=="function" then
         local info = debug.getinfo(v)

         -- skip global functions from C; line numbers aren't available via debug.getinfo
         if info.short_src ~= "[C]" then
         local url = URLEncode( ("%s#L%s-L%s"):format(info.short_src, info.linedefined, info.lastlinedefined) )
         s = s .. ("%s,%s\n"):format( k, url )
         end
      end
   end

   -- return csv data as string
   return s
end

-- local actor_classes = function()
-- end
-- ------------------------------------------

local theme = THEME:GetCurrentThemeDirectory()
local file  = RageFileUtil.CreateRageFile()

-- file path as key                 function as value
local files = {
   [theme.."GlobalFunctions.csv"] = global_functions,
   -- [theme.."ActorClasses.csv"]    = actor_classes,
}

for path, func in pairs(files) do
   if file:Open(path, 2) then
      file:Write( func() )

   else
      local fError = file:GetError()
      SCREENMAN:SystemMessage("uh oh.")
      Trace( "[FileUtils] Error writing to ".. path ..": ".. fError )
      file:ClearError()
   end
end

file:destroy()
-- ------------------------------------------
