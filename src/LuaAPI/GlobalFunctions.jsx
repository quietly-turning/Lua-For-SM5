import React, { Component } from "react"
import Octicon from 'react-octicon'
import $ from "jquery"

class GlobalFunction extends Component {

	constructor(props){
		super(props)
		// ensure that updateHash has access to "this"
		this.updateHash = this.updateHash.bind(this)
		this.getAll     = this.getAll.bind(this)

		this.allFuncs   = this.getAll()
		this.funcs      = this.allFuncs

		this.textfilter = this.props.text_filter
	}

	// unused until it is more useful
	// {gfunc.theme !== "" ? <span className="method-theme"><em>theme: </em> <span dangerouslySetInnerHTML={{__html: gfunc.theme}} /> </span> : "" }

	updateHash(gfunc_name){
		window.location.hash = "#GlobalFunctions-" + gfunc_name
	}

	getAll(){
		return this.props.global_functions.map(function(gfunc, i){
			return(
				<div id={"GlobalFunctions-" + gfunc.name} key={gfunc.name + "-" + i} className="method">
					<div className="method-signature">
						<Octicon onClick={() => this.updateHash(gfunc.name)} name="link" />
						{gfunc.name}
						(<code>{gfunc.arguments}</code>)
					</div>

					<span className="method-return"><em>return: </em> <span dangerouslySetInnerHTML={{__html: gfunc.return}} />  </span>
					<span className="method-description" dangerouslySetInnerHTML={{ __html: gfunc.desc }} />
				</div>
			)
		})
	}

	handleTFChange(){
		this.funcs = this.props.text_filter === "" ? this.allFuncs : this.filter()
		this.textfilter = this.props.text_filter
	}

	filter(){
		const text_filter = this.props.text_filter

		const filtered_funcs = this.props.global_functions.filter(function(gfunc){
			return (gfunc.name.toUpperCase().includes(text_filter) || ($("<div>").html(gfunc.desc).text() ).toUpperCase().includes(text_filter))
		})

		return filtered_funcs.map(function(gfunc, i){
			return(
				<div id={"GlobalFunctions-" + gfunc.name} key={gfunc.name + "-" + i} className="method">
					<div className="method-signature">
						<Octicon onClick={() => this.updateHash(gfunc.name)} name="link" />
						{gfunc.name}
						(<code>{gfunc.arguments}</code>)
					</div>

					<span className="method-return"><em>return: </em> <span dangerouslySetInnerHTML={{__html: gfunc.return}} /> </span>
					<span className="method-description" dangerouslySetInnerHTML={{ __html: gfunc.desc }} />
				</div>
			)
		})
	}

	render(){
		if (this.props.text_filter !== this.textfilter){ this.handleTFChange() }
		if (this.funcs.length < 1){ return null }

		return(
			<div className="GlobalFunctions actor-class">
				{this.funcs}
			</div>
		)
	}
}

export default GlobalFunction