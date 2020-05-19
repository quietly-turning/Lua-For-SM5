-- ------------------------------------------
local theme = THEME:GetCurrentThemeDirectory()
local path = ( theme .. "GlobalFunctions.csv")

local f = RageFileUtil.CreateRageFile()
local s = ""

for k,v in pairs(_G) do
	if type(v)=="function" then
		local info = debug.getinfo(v)
		if info.short_src ~= "[C]" and not (info.short_src):match("/Themes/" .. theme) then
			local url = URLEncode( ("%s#L%s-L%s"):format(info.short_src, info.linedefined, info.lastlinedefined) )
			s = s .. ("%s,%s\n"):format( k, url )
		end
	end
end

if f:Open(path, 2) then
	f:Write( s )

else
	local fError = f:GetError()
	SCREENMAN:SystemMessage("uh oh.")
	Trace( "[FileUtils] Error writing to ".. path ..": ".. fError )
	f:ClearError()
end

f:destroy()
-- ------------------------------------------