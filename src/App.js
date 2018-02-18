import React, { Component } from 'react';
import { markerLocations } from './data/markerLocations';
import axios from 'axios';

import MapComponent from './components/Map';
import Filter from './components/Filter';
import VenuesList from './components/VenuesList';
import './css/App.css';

class App extends Component {
  constructor() {
    const sortedLocations = markerLocations.sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

    super();
    this.state = {
      markerLocations: sortedLocations,
      filteredLocations: [],
      filterBars: false,
      filterFood: false,
      filterMisc: false,
      search: '',
      showVenuesList: true,
      infoWindowId: null,
      venuesDetails: {}
    };

    this.handleFilter = this.handleFilter.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleOpenInfoWindow = this.handleOpenInfoWindow.bind(this);
    this.handleCloseInfoWindow = this.handleCloseInfoWindow.bind(this);
    this.handleHide = this.handleHide.bind(this);
  }
  
  componentDidMount() {
    this.filterTypes();
  }

  filterTypes() {
    let newFilteredLocations = [...markerLocations];

    if (this.state.filterBars) {
      newFilteredLocations = newFilteredLocations.filter(location => !location.type.match('bar'));
    }
    if (this.state.filterFood) {
      newFilteredLocations = newFilteredLocations.filter(location => !location.type.match('food'));
    }
    if (this.state.filterMisc) {
      newFilteredLocations = newFilteredLocations.filter(location => location.type.match(/bar|food/));
    }
    if (this.state.search) {
      newFilteredLocations = newFilteredLocations.filter(location => {
        const name = location.name.toLowerCase();
        const type = location.type.toLowerCase();
        const search = this.state.search.toLowerCase();

        return name.match(search) || type.match(search);
      });
    }

    this.setState({
      filteredLocations: newFilteredLocations
    });
  }

  handleFilter(type) {
    this.setState({
      [type]: !this.state[type]
    }, () => {
      this.filterTypes();
    });
  }

  handleSearch(e) {
    const searchStr = e.target.value;

    this.setState({
      search: searchStr
    }, () => {
      this.filterTypes();
    });
  }

  handleOpenInfoWindow(name) {
    this.setState({
      infoWindowId: name
    }, () => {
      this.requestVenueDetails(name);
    });
  }

  handleCloseInfoWindow() {
    this.setState({
      infoWindowId: ''
    });
  }

  requestVenueDetails(venueName) {
    // Need to make a request to get venue ID
    if (!this.state.venuesDetails[venueName]) {
      const searchRequest = axios.get(`https://api.foursquare.com/v2/venues/search?query=${venueName}&near=Sacramento,CA&client_id=4O0QM0YKUBLV2ZGUVGP5I4Z2SCAEDJCVVHRZJY5OB5YD2OXD&client_secret=CSPEKLJXIEPYATOXJEYAKU1RA4VEYTCD1NRCHXNP12SIV0F3&v=20170801&limit=1`);
    
      searchRequest.then(data => {
        const venueId = data.data.response.venues[0].id;

        // Using venue ID to request venue details
        const venueInfoRequest = axios.get(`https://api.foursquare.com/v2/venues/${venueId}?client_id=4O0QM0YKUBLV2ZGUVGP5I4Z2SCAEDJCVVHRZJY5OB5YD2OXD&client_secret=CSPEKLJXIEPYATOXJEYAKU1RA4VEYTCD1NRCHXNP12SIV0F3&v=20170801`);

        venueInfoRequest.then(data => {
          let { name, location : { address }, hours, url, contact: { phone }, rating, photos, likes, description, categories } = data.data.response.venue;
          const photoUrl = `${photos.groups[0].items[0].prefix}200x300${photos.groups[0].items[0].suffix}`;

          const days = `${hours ? hours.timeframes[0].days : ''} ${hours && hours.timeframes[1] ? `, ${hours.timeframes[1].days}` : ''}`;
          const open = `${hours ? hours.timeframes[0].open[0].renderedTime : ''} ${hours && hours.timeframes[1] ? `, ${hours.timeframes[1].open[0].renderedTime}` : ''}`;
          likes = likes.summary || 'Not available';
          console.log(photoUrl);
          const newDetails = {...this.state.venuesDetails};

          newDetails[venueName] = {
            name,
            hours,
            url,
            rating,
            photoUrl,
            likes,
            description,
            categories,
            phone,
            days,
            open
          };

          this.setState({
            venuesDetails: newDetails
          }, () => {
            console.log(this.state.venuesDetails);
          })
        });
      });
    }
  }

  handleHide() {
    this.setState({
      showVenuesList: !this.state.showVenuesList
    });
  }

  render() {
    return (
      <div className="container">
        <MapComponent
          filteredVenues={this.state.filteredLocations}
          infoWindowId={this.state.infoWindowId}
          onMarkerClick={this.handleOpenInfoWindow}
          onCloseClick={this.handleCloseInfoWindow}
          venuesDetails={this.state.venuesDetails}
        />
        <div className="sidebar">
          <Filter
            showVenuesList={this.state.showVenuesList}
            onHideClick={this.handleHide} 
            onFilterBtnClick={this.handleFilter}
            onSearchInputChange={this.handleSearch}
          />
          <VenuesList 
            markerLocations={this.state.markerLocations}
            onNameClick={this.handleOpenInfoWindow}
            showVenuesList={this.state.showVenuesList}/>
        </div>
      </div>
    )
  }
}

export default App;