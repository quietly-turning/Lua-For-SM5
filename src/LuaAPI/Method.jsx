import React, { Component } from "react"
import Octicon from 'react-octicon'

class Method extends Component {

	constructor(props){
		super()

		this.id = props.sm_class_grouping + "-" + props.sm_class +  "-" + props.method.name

		// ensure that updateHash has access to "this"
		this.updateHash = this.updateHash.bind(this)
	}

	updateHash(){
		window.location.hash = "#" + this.id
	}

	render(){
		return(
			<div id={this.id} className="method">
				<div className="method-signature">
					<Octicon onClick={this.updateHash} name="link" />
					{this.props.method.name}
					(<code>{this.props.method.arguments}</code>)
				</div>

				<span className="method-return"><em>return: </em> <span dangerouslySetInnerHTML={{__html: this.props.method.return}} />  </span>
				<span className="method-description" dangerouslySetInnerHTML={{ __html: this.props.method.desc }} />
			</div>
		)
	}
}

export default Method