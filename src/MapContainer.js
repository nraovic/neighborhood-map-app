import React, { Component } from 'react';
import './App.css';
import ReactDOM from 'react-dom';
import { getData, getCafeDetails } from './Api/yelpApi.js';
import escapeRegExp from 'escape-string-regexp';
import SearchBar from './SearchBar.js';
import RestaurantDetails from './RestaurantDetails.js';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { get } from 'https';

export default class MapContainer extends Component {
  // ======================
  // ADD LOCATIONS TO STATE
  // ======================
  state = {
    results: [],
    cafesDetails: [],
    query: '',
    id: ''
  };
  markers = [];
  componentDidMount() {
    this.loadMap(); // call loadMap function to load the google map
  }

  loadMap() {
    if (this.props && this.props.google) {
      // checks to make sure that props have been passed
      const { google } = this.props; // sets props equal to google
      const maps = google.maps; // sets maps to google maps props

      const mapRef = this.refs.map; // looks for HTML div ref 'map'. Returned in render below.
      const node = ReactDOM.findDOMNode(mapRef); // finds the 'map' div in the React DOM, names it node

      const mapConfig = Object.assign({}, { center: { lat: 55.6617, lng: 12.5168 }, zoom: 13, mapTypeId: 'roadmap' }); // sets center of google map to NYC. // sets zoom. Lower numbers are zoomed further out. // optional main map layer. Terrain, satellite, hybrid or roadmap--if unspecified, defaults to roadmap.

      this.map = new maps.Map(node, mapConfig); // creates a new Google map on the specified node (ref='map') with the specified configuration set above.

      // ==================
      // ADD MARKERS TO MAP
      // ==================
      getData().then(results => {
        this.setState({
          results
        });
      });
    }
  }

  getMatchedResults = () => {
    let showingResults;
    if (this.state.query) {
      const match = new RegExp(escapeRegExp(this.state.query), 'i');
      showingResults = this.state.results.filter(result => match.test(result.name));
    } else {
      showingResults = this.state.results;
    }
    return showingResults;
  };
  updateQuery = event => {
    const query = event.target.value;
    this.setState({
      query: query
    });
  };
  updateID = id => {
    this.setState({ id });
    console.log(id);
  };
  render() {
    const style = {
      // MUST specify dimensions of the Google map or it will not work. Also works best when style is specified inside the render function and created as an object
      height: '100vh' // 75vh similarly will take up roughly 75% of the height of the screen. px also works.
    };
    const { google } = this.props; // sets props equal to google
    const maps = google.maps; // sets maps to google maps props

    //Clear the markers from the map
    for (let marker of this.markers) {
      marker.setMap(null);
    }
    this.markers = [];
    const matchedResults = this.getMatchedResults();
    return (
      // in our return function you must return a div with ref='map' and style.
      <Router>
        <div className="container">
          {console.log(this.state.query)}
          <div className="search-container">
            <input
              className="search-input"
              type="text"
              placeholder="Seach for a cafe"
              value={this.state.query}
              onChange={this.updateQuery}
            />
            <Route
              exact
              path="/"
              render={() => <SearchBar updateID={this.updateID} matchedResults={this.getMatchedResults} />}
            />
            <Route path={`/details`} render={() => <RestaurantDetails idUrl={this.state.id} />} />
            {/*and here its without the bracets */}
          </div>
          <div className="map-container">
            <div>
              {matchedResults.map(result => {
                // iterate through locations saved in state
                const marker = new google.maps.Marker({
                  // creates a new Google maps Marker object.
                  position: { lat: result.location.lat, lng: result.location.lng },
                  map: this.map,
                  title: result.name
                }); // sets position of marker to specified location // sets markers to appear on the map we just created on line 35 // the title of the marker is set to the name of the location
                this.markers.push(marker);
                var infowindow = new google.maps.InfoWindow({ content: `<h3>${result.name}</h3>` });
                marker.addListener('click', function() {
                  infowindow.open(this.map, marker);
                });
              })}
            </div>
            <div className="map" ref="map" style={style}>
              loading map...
            </div>
          </div>
        </div>
      </Router>
    );
  }
}
