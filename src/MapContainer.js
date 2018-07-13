import React, { Component } from 'react';
import './App.css';
import ReactDOM from 'react-dom';
import { getData, getCafeDetails } from './Api/yelpApi.js';
import escapeRegExp from 'escape-string-regexp';
import SearchBar from './SearchBar.js';
import RestaurantDetails from './RestaurantDetails.js';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import { createRef } from 'create-react-ref';
import { Redirect } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

export default class MapContainer extends Component {
  state = {
    results: [], // List of cafes' objects
    query: '', // User's input from the Filter field
    id: window.location.href.substring(window.location.href.lastIndexOf('/') + 1), // Cafe's ID, initially obtained from the window location so that the Details page can be directly loaded (and not only from the Main page)
    cafesDetails: {}, // Key-value pairs of each of the cafes IDs and its detailed data
    redirect: false, // Redirect to the Deails page?
    toggle: false, // Toggle the search results?
    apiRequestFailed: false,
    detailsApiRequestFailed: false
  };
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
      const lat = 55.6837;
      const lng = 12.5716;
      const mapConfig = Object.assign({}, { center: { lat: lat, lng: lng }, zoom: 13, mapTypeId: 'roadmap' }); // sets center of google map to NYC. // sets zoom. Lower numbers are zoomed further out. // optional main map layer. Terrain, satellite, hybrid or roadmap--if unspecified, defaults to roadmap.

      this.map = new maps.Map(node, mapConfig); // creates a new Google map on the specified node (ref='map') with the specified configuration set above.

      // Get the cafes data and add markers to the map for each cafe
      getData()
        .then(results => {
          for (let result of results) {
            const image = { size: new google.maps.Size(20, 32) };
            // Creates a new Google maps Marker object
            result['marker'] = new google.maps.Marker({
              position: { lat: result.location.lat, lng: result.location.lng },
              map: this.map,
              title: result.name,
              id: result.id
            });
            /*result['infoWindow'] = new google.maps.InfoWindow({
            content: `<h3>${result.name}</h3>`
          });*/

            result.marker.addListener('click', this.markerClick.bind(this, result.id, result), false);
            //   // result.infoWindow.open(this.map, result.marker);
            //   //this.update(result.id, result);
            //   //window.location.href = `/details/${result.id}`;
            // });
          }
          //Set the state for the results when data received
          this.setState({
            results
          });
        })
        .catch(err => {
          this.setState({ apiRequestFailed: true });
        }); // Resolve the reject from Foursquare API
    }
  }
  // Redirect to Details page on a marker click and toggle the Details if the screen is small
  markerClick(id, cafe) {
    this.setState({ redirect: true, id: id });
    this.clickToggle();
    // Set other markers to invisible
    this.deleteMarkers(cafe)
  }

  // Get the results that match the user's search query
  getMatchedResults = () => {
    let showingResults;
    if (this.state.query) {
      const match = new RegExp(escapeRegExp(this.state.query), 'i');
      showingResults = this.state.results.filter(result => match.test(result.name));
    } else {
      showingResults = this.state.results;
    }
    // Set visibility for the markers in the matched results
    for (let result of this.state.results) {
      if (showingResults.includes(result)) {
        result.marker.setVisible(true);
      } else {
        result.marker.setVisible(false);
      }
    }
    console.log('hey')
    return showingResults;
  };
  updateQuery = event => {
    event.preventDefault();
    const query = event.target[0].value; // The target is the form, and query is its the first element
    this.setState({
      query: query
    });
  };

  // Update id and add bounce on link click for 1500ms
  cafeLinkClick = (id, cafe) => {
    this.setState({ id });
    const google = this.props.google;
    // Set other markers to invisible
    this.deleteMarkers(cafe)
    cafe.marker.setAnimation(google.maps.Animation.null);
    /*cafe.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      cafe.marker.setAnimation(null);
    }, 1500);*/
  };
  //Get cafe's details if not already in this.state.cafeDetails
  updateCafesDetails = () => {
    if (!(this.state.id in this.state.cafesDetails)) {
      getCafeDetails(this.state.id)
        .then(results => {
          const updatedDetails = Object.assign({}, this.state.cafesDetails);
          updatedDetails[this.state.id] = results;
          console.log(updatedDetails);
          this.setState({ cafesDetails: updatedDetails });
        })
        .catch(err => {
          this.setState({ detailsApiRequestFailed: true }); // Resolve the reject from Foursquare API
        });
    }
  };
  // Redirect to Details page
  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect from={`/`} push to={`/details/${this.state.id}`} />;
      // <Router path="/details" render={() => <Redirect push to={`/details/${this.state.id}`} />} />;
    }
  };
  //Helper function used to ser other markers to invisible when Details page showed
  deleteMarkers = cafe => {
    this.state.results.map(result => {
      if (result !== cafe) {
        result.marker.setVisible(false);
      }
    });
  };
  clickToggle = () => {
    const currentState = this.state.toggle;
    this.setState({ toggle: !currentState });
  };
  startBounce = cafe => {
    const google = this.props.google;
    cafe.marker.setAnimation(google.maps.Animation.BOUNCE);
  };
  endBounce = cafe => {
    const google = this.props;
    cafe.marker.setAnimation(null);
  };
  render() {
    const url = window.location.href;
    console.log(url);
    console.log(url.substring(url.lastIndexOf('/') + 1));

    const style = {
      // MUST specify dimensions of the Google map
      height: '100vh'
    };
    const { google } = this.props;
    const maps = google.maps;
    //const matchedResults = this.getMatchedResults();
    return (
      // in our return function you must return a div with ref='map' and style.
      //Wrap the DOM in Router
      <Router>
        <div className="main-page">
          <div className="title-container">
            <button className="hamburger-btn" onClick={this.clickToggle}>
              <FontAwesomeIcon icon={faBars} />
            </button>
            <h1 className="title">Kbh Cafes</h1>
            {/*Handle a fail from Foursquare API*/}
            {this.state.apiRequestFailed && (
              <div>We are sorry. The API request to Foursquare has failed. Please try again later.</div>
            )}
          </div>
          <div className="main-container">
            <div className={this.state.toggle ? 'search-container toggle' : 'search-container'}>
              {/* Add Route to the Search Bar with the same path as the main page */}
              <Route
                exact
                path="/"
                render={() => (
                  <SearchBar
                    cafeLinkClick={this.cafeLinkClick}
                    google={this.props.google}
                    stopBounce={this.endBounce}
                    startBounce={this.startBounce}
                    matchedResults={this.getMatchedResults}
                    updateQuery={this.updateQuery}
                  />
                )}
              />
              {/* The page redirects and shows the Details page on a marker click */}
              {this.renderRedirect()}
              {/* Add Route to the Details Bar with the details path */}
              <Route
                path={`/details/${this.state.id}`}
                render={() => (
                  <RestaurantDetails
                    idUrl={this.state.id}
                    redirect={this.state.redirect}
                    cafesDetails={this.state.cafesDetails}
                    updateCafesDetails={this.updateCafesDetails}
                    apiRequest={this.state.detailsApiRequestFailed}
                  />
                )}
              />
            </div>
            <div className="map-container">
              <div>{/* For each result, check if it's in the matchedResults and set it to visible*/}</div>
              <div className="map" ref="map" style={style}>
                loading map...
              </div>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}
