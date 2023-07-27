import React, { Component } from "react";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";

class MapView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: props.prevlca ? { location: props.prevlca } : { location: {} },
      currentLocation: props.prevlca ? props.prevlca : false,
    };
  }
  async componentDidMount() {
    if (Object.keys(this.state.fields.location).length === 0) {
      const { lat, lng } = await this.getcurrentLocation();
      this.setState((prev) => ({
        fields: {
          ...prev.fields,
          location: {
            lat,
            lng,
          },
        },
        currentLocation: {
          lat,
          lng,
        },
      }));
    }
  }

  getcurrentLocation() {
    if (navigator && navigator.geolocation) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((pos) => {
          const coords = pos.coords;
          resolve({
            lat: coords.latitude,
            lng: coords.longitude,
          });
        });
      });
    }
    return {
      lat: 0.0,
      lng: 0,
    };
  }
  addMarker = (location, map) => {
    console.log("location2",location, map)
    this.setState({
      fields: { location: { lat: location.lat(), lng: location.lng() } },
    });
    map.panTo(location);
    this.props.onMarkerClick(location);
  };

  render() {
    const { lat = 0, lng = 0 } = this.state.fields.location;
    console.log("location1",this.state.fields.location)
    // var bounds = new this.props.google.maps.LatLngBounds();
    return (
      <div>
        <Map
          google={this.props.google}
          style={{
            width: "100%",
            height: "100%",
          }}
          initialCenter={{ lat: lat || 0, lng: lng || 0 }}
          center={{ lat: lat || 0, lng: lng || 0 }}
          zoom={14}
          mapTypeId="roadmap"
          onClick={(t, map, c) => {
            this.addMarker(c.latLng, map);
          }}
          // bounds={bounds}
        >
          <Marker
            tooltip={true}
            name="Your Position"
            position={this.state.fields.location}
            onClick={this.props.onMarkerClick}
          />
        </Map>
      </div>
    );
  }
}
export default GoogleApiWrapper({
  apiKey: "AIzaSyB6w_WDy6psJ5HPX15Me1-o6CkS5jTYWnE",
})(MapView);
