import { Route, Routes } from "react-router-dom"


function TableOfContents(props){

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

  return (
    <Routes>
      <Route path="/:group/:page" element={
        el()
      } />
    </Routes>
  )
}

export default TableOfContents