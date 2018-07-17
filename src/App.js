import React, { Component } from 'react';
// import the Google Maps API Wrapper from google-maps-react
import { GoogleApiWrapper } from 'google-maps-react';
import MapContainer from './MapContainer';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <MapContainer google={this.props.google} />
      </div>
    );
  }
}
// OTHER MOST IMPORTANT: Here we are exporting the App component WITH the GoogleApiWrapper. You pass it down with an object containing your API key
export default GoogleApiWrapper({
  apiKey: 'AIzaSyAEs1oz4Tk4loTRw9JQRvTF1ufAQ7Z2Jmk'
})(App);
