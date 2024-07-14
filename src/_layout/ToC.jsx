import { Route, Routes } from "react-router-dom"

function ToC(props){

  const tableOfContents = props.toc?.map(header=>{
    return <li><a href={'#' + header.id}> {header.text}</a></li>
  })

  return (
    <Routes>
      <Route path="/:group/:page" element={
        <div id="TocContainer" className="bd-toc col-xl-3 me-2 d-lg-block d-none">
          <strong className="d-block h6 my-2 pb-2 border-bottom">On this page</strong>
          <nav id="TableOfContents">
            {tableOfContents}
          </nav>
        </div>
      } />
    </Routes>
  )
}

export default ToC