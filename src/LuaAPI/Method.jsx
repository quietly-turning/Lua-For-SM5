import React, { Component } from "react"
import Octicon, {getIconByName} from '@primer/octicons-react'

class Method extends Component {

	constructor(props){
		super(props)

		this.id = this.props.sm_class_grouping + "-" + this.props.sm_class +  "-" + this.props.method.name

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
					<span className="octicon-link" onClick={this.updateHash}><Octicon icon={getIconByName("link")} /></span>
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