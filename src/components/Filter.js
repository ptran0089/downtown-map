import React, { Component } from 'react';

class Filter extends Component {
  render() {
    return (
      <div className="filters">
        <button onClick={this.props.onHideClick}>{this.props.showVenuesList ? 'Hide List' : 'Show List'}</button>
        <input type="text" placeholder="Filter by name or activity" onChange={this.props.onSearchInputChange}/>
        <div className="filter-btns">
          <input type="checkbox" className="filter-checkbox" id="bars" onChange={() => this.props.onFilterBtnClick('filterBars')}/>
          <label className="filter-lable" htmlFor="bars">Bars</label>
          <input type="checkbox" className="filter-checkbox" id="food" onChange={() => this.props.onFilterBtnClick('filterFood')}/>
          <label className="filter-lable" htmlFor="food">Food</label>
          <input type="checkbox" className="filter-checkbox" id="misc" onChange={() => this.props.onFilterBtnClick('filterMisc')}/>
          <label className="filter-lable" htmlFor="misc">Misc</label>
        </div>
      </div>
    );
  }
}

export default Filter;