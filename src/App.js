import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import './App.css';
// import the Google Maps API Wrapper from google-maps-react
import { GoogleApiWrapper } from 'google-maps-react';
// import child component
import MapContainer from './MapContainer';
import SearchBar from './SearchBar.js';
import RestaurantDetails from './RestaurantDetails';
class App extends Component {
  render() {
    const title = "Valby Cafe's";
    return (
      <div>
        <h1>{title}</h1>
        <MapContainer google={this.props.google} />
      </div>
    );
  }
}
// OTHER MOST IMPORTANT: Here we are exporting the App component WITH the GoogleApiWrapper. You pass it down with an object containing your API key
export default GoogleApiWrapper({
  apiKey: 'AIzaSyAEs1oz4Tk4loTRw9JQRvTF1ufAQ7Z2Jmk'
})(App);
