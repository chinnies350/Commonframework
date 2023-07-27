
import React, { Component}  from 'react'
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';

class MapView extends Component {
    constructor(props){
        super (props)
        this.state = {
            fields: props.prevlca ? {"location" : props.prevlca} :  {"location" : false},
            currentLocation : props.prevlca ?  props.prevlca : false
        }
    } 
    async componentDidMount() {
   
      if(!this.state.fields.location){
        const { lat, lng } = await this.getcurrentLocation();
       
        this.setState(prev => ({
          fields: {
            ...prev.fields,
            location: {
              lat,
              lng
            }
          },
          currentLocation: {
            lat,
            lng
          }
        }));
      }
      }
    
       getcurrentLocation() {
        if (navigator && navigator.geolocation) {
          return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(pos => {
              const coords = pos.coords;
             
              resolve({
                lat: coords.latitude,
                lng: coords.longitude
              });
            });
          });
        }
        return {
          lat: 0.0,
          lng: 0
        };
      }
      addMarker = (location, map) => {
      
        this.setState(prev => ({
          fields: {
            ...prev.fields,
            location
          }
        }));
        map.panTo(location);
      };
      
    render() {
      
      const {lat, lng} = this.state.fields.location
     
        return (
            <div>
                <Map
                  google={this.props.google}
                  style={{
                    width: "100%",
                    height: "100%"
                  }}
                  initialCenter={{lat : lat,lng : lng }}
                  center={{lat : lat ,lng :  lng }}
                  zoom={14}
                  onClick={(t, map, c) => this.addMarker(c.latLng, map)}
                >
                  <Marker position={this.state.fields.location} onClick={this.props.onMarkerClick} />
                </Map>
            </div>
        )
    }
}
export default GoogleApiWrapper({
    apiKey: ("AIzaSyB6w_WDy6psJ5HPX15Me1-o6CkS5jTYWnE")
  })(MapView)



