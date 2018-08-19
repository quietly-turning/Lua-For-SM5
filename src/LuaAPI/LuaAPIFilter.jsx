import React from "react";

class LuaAPIFilter extends React.Component {
	constructor(props) {
		super(props)
		this.handleFilter = this.handleFilter.bind(this)
	}

	handleFilter(e) {
		this.props.onFilterChange(e.target.value)
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