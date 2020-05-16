import React, { Component } from "react"
import Octicon from 'react-octicon'
import Method from "./Method"

class Singleton extends Component {

	constructor(props){
		super()
		// ensure that updateHash has access to "this"
		this.updateHash = this.updateHash.bind(this)
	}

	updateHash(){
		window.location.hash = "#Singletons-" + this.props.singleton.sm_class
	}

	getMethodsToRender(){
		const sm_class = this.props.singleton.sm_class

		return this.props.singleton.methods.map(function(method, j){
			return <Method sm_class_grouping="Singletons" sm_class={sm_class} method={method} key={sm_class + "-" + method.name + j} />
		})
	}

	render(){
		return(
			<div id={"Singletons-" + this.props.singleton.sm_class} className="actor-class">
				<h3>
					<Octicon onClick={this.updateHash} name="link" />
					{this.props.singleton.sm_class}
				</h3>
				<hr />

				<span className="actorclass-description" dangerouslySetInnerHTML={{__html: this.props.singleton.desc}} />

				{this.getMethodsToRender()}
			</div>
		)
	}
}

export default Singleton