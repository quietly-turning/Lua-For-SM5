import { Component } from "react"

import Header      from "./Header"
import Description from "./Description"
import Method      from "./Method"

class SectionGlobalFunction extends Component {

	constructor(props){
		super(props)

		this.funcs = this.props.data.map(function(gfunc, i){
			return <Method grouping={gfunc.grouping} method={gfunc} url key={gfunc.name}  />
		})
	}

	render(){
		return(
			<section>
				<Header name={this.props.name} className="sticky" smclass={{}} level={2} />

				<Description desc={this.props.desc} />

				<div>{this.funcs}</div>
			</section>
		)
	}
}

export default SectionGlobalFunction