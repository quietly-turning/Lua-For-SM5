const recursive = require("recursive-readdir")
const fs        = require("fs")
const path      = require("path")

const regex      = /\.html$/
const pagesPath  = "src/Pages"

recursive(pagesPath, (err, files) => {

    const obj = {}

    files.forEach(filepath => {
        // only read files with ".html" extensions
        if (filepath.match(regex)){
            // normalize the filepath and ensure it uses forward slash as its
            // separator (e.g. on a windows dev machine, we still want to
            // generate urls with forward slashes)
            const normalizedFilePath = path.normalize(filepath).split(path.sep).join("/")

            // transform a string like "src/Pages/Resources.html" to "Resources" to use as an object key
            let k = normalizedFilePath.replace(regex, "").replace(pagesPath, "")

            // special-case to map "Home" to empty string so that it matches the url of "/" instead of "/Home"
            if (k==="/Home"){ k="/" }

            // read the content of the html file and store it at obj[k]
            obj[k] = fs.readFileSync(normalizedFilePath, "utf8")
        }
    })

    // stringify obj to JSON and write to disk
    fs.writeFile(
        'src/page-content.js',
        "export default " + JSON.stringify(obj),
        error => {
            // error handling...
        }
    )
})
