import React, { Component } from "react"
import Octicon, {getIconByName} from '@primer/octicons-react'

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

	// temp for now; can make less hardcoded later
	github_url = "https://github.com/stepmania/stepmania/tree/"
	sm_hash = "6bea7639e8c184ca5d681d5d2f665c71eef64d44"

	updateHash(gfunc_name){
		window.location.hash = "#GlobalFunctions-" + gfunc_name
	}

	getAll(){
		// retain handle to this GlobalFunction for the context change within map()
		const gf = this
		return this.props.global_functions.map(function(gfunc, i){

			const github_anchor = gfunc.url !== undefined ? <a className="logo-github" href={gf.github_url + gf.props.githash + gfunc.url} target="_blank" rel="noopener noreferrer"><Octicon icon={getIconByName("logo-github")} /></a> : ""

			return(
				<div id={"GlobalFunctions-" + gfunc.name} key={gfunc.name + "-" + i} className="method global-function">
					<div className="method-signature">
						<span className="octicon-link" onClick={() => gf.updateHash(gfunc.name)}><Octicon icon={getIconByName("link")} /></span>
						<span>
							{gfunc.name}
							(<code>{gfunc.arguments}</code>)
						</span>
						{github_anchor}
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
						<span className="octicon-link" onClick={() => this.updateHash(gfunc.name)}><Octicon icon={getIconByName("link")} /></span>
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