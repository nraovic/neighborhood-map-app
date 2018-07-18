import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react';
import MainPage from './MainPage';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <MainPage google={this.props.google} />
      </div>
    );
  }
}
// Exporting the App component WITH the GoogleApiWrapper.
export default GoogleApiWrapper({
  apiKey: 'AIzaSyAEs1oz4Tk4loTRw9JQRvTF1ufAQ7Z2Jmk'
})(App);
