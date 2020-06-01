import React, { Component } from "react"
import Octicon, {getIconByName} from '@primer/octicons-react'

class Method extends Component {

	constructor(props){

		super(props)

		// class methods will have an sm_class prop, but GlobalFunctions will not
		const sm_class = (this.props.sm_class !== undefined) ?  ("-" + this.props.sm_class) : ""
		const _name    = "-" + this.props.method.name
		this.id = this.props.grouping + sm_class + _name

		// ensure that updateHash has access to "this"
		this.updateHash = this.updateHash.bind(this)

		// temp for now; can make less hardcoded later
		const sm_url  = "https://github.com/quietly-turning/stepmania/tree/"
		const sm_hash = "HEAD"

		this.github_anchor = this.props.method.url !== undefined ? <a className="logo-github" href={sm_url + sm_hash + this.props.method.url} target="_blank" rel="noopener noreferrer"><Octicon icon={getIconByName("logo-github")} /></a> : ""
	}

	updateHash(){
		window.location.hash = "#" + this.id
	}

	render(){
		return(
			<div id={this.id} className="method">
				<div className="method-signature">
					<span className="octicon-link" onClick={this.updateHash}><Octicon icon={getIconByName("link")} /></span>
					<span>
						{this.props.method.name}
						(<code>{this.props.method.arguments}</code>)
					</span>
					{this.github_anchor}
				</div>

				<span className="method-return"><em>return: </em> <span dangerouslySetInnerHTML={{__html: this.props.method.return}} />  </span>
				<span className="description description" dangerouslySetInnerHTML={{ __html: this.props.method.desc }} />
			</div>
		)
	}
}

export default Method