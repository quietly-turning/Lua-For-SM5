import $ from "jquery"

// some class and method descriptions contain <Link> elements,
// intended to serve as anchors to elsewhere within the document
// we need to find and replace them with html-compliant anchors
function formatTextWithLinks(element, lua_api){
  if (element === undefined){ return "" }

  const anchors = []

  for (const l of element.find("Link")){

    // find the function and class attributes of this <Link>
    // as well as text (jQuery will return an empty string for self-closing elements without text)
    // and put them in this temporary convenience object
    const link = {
      f: $(l).attr("function"),
      c: $(l).attr("class"),
      t: $(l).text()
    }

    // recreate the logic from Lua.xsl for handling <Link> elements
    //    look for   <xsl:template match="sm:Link">

    // class attribute is absent and function attribute is present
    // so we're linking to a function in the current class/namespace.
    if (link.c === undefined && link.f !== undefined){

      // It was possible in LuaDocumentation.xml to create a <Link> to some other method
      // *within* the current Class using a compact syntax like <Link function="zoomy"/>
      // Unfortunately, that leaves us trying to figure out what the "current Class" is
      // in the context of this React app.  We'll get the parentNode of the method object.

      const parent_name = element.parent().attr("name")
      const text = link.t !== "" ? link.t : link.f

      if (parent_name){

        // check Actors, Screens, Classes, Singletons, Namespaces, and Enums first
        for (const i in lua_api.sections){
          if (lua_api[lua_api.sections[i]][parent_name]){
            anchors.push( `<a href="#${lua_api.sections[i]}-${parent_name}-${link.f}">${text}</a>` )
            break
          }
        }

      // if not, assume we're linking to a GlobalFunction
      } else {
        anchors.push( `<a href="#GlobalFunctions-${link.f}">${text}</a>` )
      }


    // class attribute is present and function attribute is absent
    // so we're linking to a class/namespace
    } else if (link.c !== undefined && link.f === undefined){

      const text = link.t !== "" ? link.t : link.c
      // e.g. <Link class='Enums' />
      let anchor = `<a href='#${link.c}'>${text}</a>`

      for (const i in lua_api.sections){
        if (lua_api[lua_api.sections[i]][link.c]){
          // e.g. <Link class='LifeMeter' />
          anchor = `<a href='#${lua_api.sections[i]}-${link.c}'>${text}</a>`
          break
        }
      }

      anchors.push(anchor)


    // Linking to a global function or an enum.
    } else if ((link.c === "GLOBAL" || link.c === "ENUM") && (link.f !== undefined)){

      const text = link.t !== "" ? link.t : link.f

      if (link.c === "GLOBAL"){
        // create the anchor string for this Global Function
        anchors.push( `<a href='#GlobalFunctions-${link.f}'>${text}</a>` )

      } else if (link.c === "ENUM") {
        // create the anchor string for this Enum
        anchors.push( `<a href='#Enums-${link.f}'>${text}</a>` )
      }


    // Linking to a function in a class/namespace.
    } else if (link.c !== undefined && link.f !== undefined) {

      let anchor

      // ensure that link.c matches an ActorClass before creating an anchor to it
      // lua_api.Classes is a convenience object with string keys that match Class names
      for (const i in lua_api.sections){
        if (lua_api[lua_api.sections[i]][link.c] ){

          let text
          // if this was a <Link>text</Link> element, use the text provided
          // if this was a self-closing link, use class.function and append "()"
          if (lua_api.sections[i] === "Singletons"){
            text = link.t !== "" ? link.t : (`${lua_api.Singletons[link.c]}:${link.f}()`)
          } else {
            text = link.t !== "" ? link.t : (`${link.c}.${link.f}()`)
          }

          anchor = `<a href='#${lua_api.sections[i]}-${link.c}-${link.f}'>${text}</a>`
          break
        }
      }

      // <Link> element was found with no documentation to link to...
      // a current example is <Link class='ThemePrefs' function='Get' />
      if (anchor === undefined){
        anchor = "<code>" + (link.t !== "" ? link.t : (link.c + "." + link.f + "()")) + "</code>"

      }

      anchors.push(anchor)
    }

    // else ignore this <Link>.
  }

  $(element).find("Link").each(function(i, obj){
    $(this).replaceWith(anchors[i])
  })

  $(element).find("pre code").each(function(i, code){
    // trim leading newline if one is found
    const txt = code.textContent.charAt(0)==="\n" ? code.textContent.substr(1) : code.textContent
    $(code).replaceWith("<code class='lua'>" + txt + "</code>")
  })

  return (element.html() || "").trim()
}


// ---------------------------------------------------------------------
// a helper function to determine whether the "return" type of each API method
// should be static text or an anchor linking to elsewhere in the document

function getReturnValue(r){
  if (r === undefined) { return "" }

  // if the return text for this method exactly matches "void" just use that
  if (r === "void"){ return r }

  // maybe this method's return value is wrapped in curly braces
  // indicating that this method returns a table of something
  const _r = r.match(/{(.+)}/)
  if (_r) { r = _r[1] }

  let anchor

  const _sections = ["Classes", "Actors", "Screens", "Enums"]
  for (const i in _sections){
    if (this[_sections[i]][r]){
      anchor = `<a href='#${_sections[i]}-${r}'>${r}</a>`
      break
    }
  }

  if (anchor === undefined){
    // otherwise, we have something like "bool" or "int"; just return it
    anchor = r
  }

  return (_r ? "{ " : "") + anchor + (_r ? " }" : "")
}

export {
  formatTextWithLinks, getReturnValue
}