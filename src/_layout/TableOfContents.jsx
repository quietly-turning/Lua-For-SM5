import { useEffect }     from "react"
import { Route, Routes } from "react-router-dom"


function TableOfContents(props){

  function scroll_window_after_hashchange(hash){
    hash = hash ?? window.location.hash

    if (hash) {
      const el = document.getElementById(hash.replace("#",""))
      if (el){
        const y_offset = el.offsetTop
        if (y_offset){
          const topbar_height = props.mobile_nav ? 128 : 60
          window.scrollTo(0, y_offset-topbar_height)
        }
      }
    }
  }

  const tableOfContents = props.toc?.map((header, i)=>{
    return <li key={'section'+i}><a href={'#' + header.id}> {header.text}</a></li>
  })

  const el = () => {
    if (props.toc?.length <= 0){
      return
    }

    return (
      <div id="toc-container" className="bd-toc col-lg-2 me-2 d-lg-block d-none">
        <strong className="d-block h6 my-2 pb-2 border-bottom">On this page</strong>
        <nav id="TableOfContents">
          {tableOfContents}
        </nav>
      </div>
    )
  }

  useEffect(() => {
    scroll_window_after_hashchange()
  },[window.location.hash])

  return (
    <Routes>
      <Route path="/:group/:page" element={
        el()
      } />
    </Routes>
  )
}

export default TableOfContents