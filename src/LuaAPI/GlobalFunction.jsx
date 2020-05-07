import React, { Component } from "react"
import Octicon from 'react-octicon'

class GlobalFunction extends Component {

	constructor(){
		super()
		// ensure that these functions have access to "this"
		this.updateHash = this.updateHash.bind(this)
	}

	updateHash(){
		window.location.hash = "#GlobalFunctions-" + this.props.global_function.name
	}

	render(){
		return(
			<div id={"GlobalFunctions-" + this.props.global_function.name} className="method">
				<div className="method-signature">
					<Octicon onClick={this.updateHash} name="link" />
					{this.props.global_function.name}
					(<code>{this.props.global_function.arguments}</code>)
				</div>

				<span className="method-return"><em>return: </em> <span dangerouslySetInnerHTML={{__html: this.props.global_function.return}} />  </span>
				<span className="method-description" dangerouslySetInnerHTML={{ __html: this.props.global_function.desc }} />
			</div>
		)
	}
}

export default GlobalFunction