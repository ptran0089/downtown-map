import React, { Component } from 'react';

class VenuesList extends Component {
  render() {
    if (this.props.showVenuesList) {
      return (
        <div className="list">
          <h1>Key Venues</h1>
          <ul>
            {
              this.props.markerLocations.map((location, index) => {
                return <li key={index} onClick={() => this.props.onNameClick(location.name)}>{location.name}</li>
              })
            }
          </ul>
        </div>
      );
    } else {
      return (
        <div className="list">
          <h1>Key Venues</h1>
          <ul className="hidden">
            {
              this.props.markerLocations.map((location, index) => {
                return <li key={index} onClick={() => this.props.onNameClick(location.name)}>{location.name}</li>
              })
            }
          </ul>
        </div>
      );
    }
  }
}

export default VenuesList;