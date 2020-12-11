const recursive = require("recursive-readdir")
const fs = require("fs")

const regex = /\.html$/
const path = "src/Pages"

recursive(path, function(err, files){

	const obj = {}

	files.forEach(file => {
		// only read files with ".html" extensions
		if (file.match(regex)){
			// transform a string like "src/Pages/Resources.html" to "Resources" to use as an object key
			let k = file.replace(regex,"").replace(path,"")

			// special-case to map "Home" to empty string so that it matches the url of "/" instead of "/Home"
			if (k==="/Home"){ k="/" }

			// read the content of the html file and store it at obj[k]
			obj[k] = fs.readFileSync(file, "utf8")
		}
	})

	// stringify obj to JSON and write to disk
	fs.writeFile( 'src/page-content.js', "export default " + JSON.stringify(obj), function(error){
	    // error handling...
	})
})