import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from 'react-google-maps';
import { compose, withProps } from 'recompose';

const MapComponent = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyBhZ6Ek1-XyooLpva7etUCtPn2CWHcseDI",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100vh` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap
    defaultZoom={10}
    defaultCenter={{ lat: 38.73789799666863, lng: -121.19947869062844 }}
  >
    {
      props.filteredVenues.map((venue, index) => {
        return (
          <Marker position={{ lat: venue.lat, lng: venue.lng }} onClick={() => props.onMarkerClick(venue.name)} key={index}>
            {
              // Check name and open the correct info window
              props.infoWindowId === venue.name && 
              <InfoWindow onCloseClick={props.onCloseClick}>
                {
                  props.venuesDetails[venue.name] ? 
                  <div className="info-window">
                    <div className="img-container">
                      <img src={props.venuesDetails[venue.name].photoUrl} alt={venue.name}/>
                    </div>
                    <div>{props.venuesDetails[venue.name].name}</div>
                    <div>{props.venuesDetails[venue.name].address}</div>
                    <div>{props.venuesDetails[venue.name].days}</div>
                    <div>{props.venuesDetails[venue.name].open}</div>
                    <div>Phone: {props.venuesDetails[venue.name].phone}</div>
                    <div>Website: {props.venuesDetails[venue.name].url}</div>
                    <div>Rating: {props.venuesDetails[venue.name].rating}</div>
                    <div>{props.venuesDetails[venue.name].likes}</div>
                    <div>{props.venuesDetails[venue.name].description}</div>
                  </div>
                  : 
                  <div>Loading...</div>
                }
              </InfoWindow>
            }
          </Marker>
        );
      })
    }
  </GoogleMap>
);

export default MapComponent;