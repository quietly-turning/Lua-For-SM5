import React from "react";

class LuaAPIFilter extends React.Component {
	constructor(props) {
		super(props)
		this.handleFilter = this.handleFilter.bind(this)

		// the LuaAPI doesn't need to be filtered and re-filtered with each new keyup event
		// instead, wait 200ms for keyup events to cease before calling filterResults()
		// these variables are used as part of that 0.2 second timeout system
		// see: https://stackoverflow.com/a/5926782
		this.typingTimer = null
		this.doneTypingInterval = 200
	}

	handleFilter(e){

		const eventValue = e.target.value
		const filter_object = this

		clearTimeout(this.typingTimer)

		this.typingTimer = setTimeout(
			function() {
				filter_object.props.onFilterChange(eventValue.toUpperCase())
			},
			this.doneTypingInterval
		)
	}

	render() {
		return (
			<fieldset>
				<label htmlFor="filter">API Search:</label><br/>
				<input type="text" id="filter" onChange={this.handleFilter} />
			</fieldset>
		)
  }
}

export default LuaAPIFilter