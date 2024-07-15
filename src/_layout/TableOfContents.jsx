import { Route, Routes } from "react-router-dom"

function TableOfContents(props){

  const tableOfContents = props.toc?.map((header, i)=>{
    return <li key={'section'+i}><a href={'#' + header.id}> {header.text}</a></li>
  })

  return (
    <Routes>
      <Route path="/:group/:page" element={
        <div id="toc-container" className="bd-toc col-lg-2 me-2 d-lg-block d-none">
          <strong className="d-block h6 my-2 pb-2 border-bottom">On this page</strong>
          <nav id="TableOfContents">
            {tableOfContents}
          </nav>
        </div>
      } />
    </Routes>
  )
}

export default TableOfContents