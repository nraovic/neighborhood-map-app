import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import escapeRegExp from 'escape-string-regexp';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Redirect } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import SearchBar from './SearchBar.js';
import RestaurantDetails from './RestaurantDetails.js';
import { getData, getCafeDetails } from './Api/yelpApi.js';
import './App.css';

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
      const { google } = this.props;
      const maps = google.maps;
      const mapRef = this.refs.map; // Looks for HTML div ref 'map'. Returned in render below.
      const node = ReactDOM.findDOMNode(mapRef); // Finds the 'map' div in the React DOM, names it node
      const lat = 55.6837; // Latitude of Copenhagen Center
      const lng = 12.5716; // Longitude of Copenhagen Center
      const mapConfig = Object.assign({}, { center: { lat: lat, lng: lng }, zoom: 13, mapTypeId: 'roadmap' }); // sets center of google map to Copenhagen Center.

      this.map = new maps.Map(node, mapConfig); // creates a new Google map on the specified node (ref='map') with the specified configuration set above.

      // Get the cafes data and add markers to the map for each cafe
      getData()
        .then(results => {
          for (let result of results) {
            // Creates a new Google maps Marker object
            result['marker'] = new google.maps.Marker({
              position: { lat: result.location.lat, lng: result.location.lng },
              map: this.map,
              title: result.name,
              id: result.id
            });
            result.marker.addListener('click', this.markerClick.bind(this, result.id, result), false);
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
    this.deleteMarkers(cafe);
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
    return showingResults;
  };
  updateQuery = event => {
    event.preventDefault();
    const query = event.target[0].value; // The target is the form, and query is its first element
    this.setState({
      query: query
    });
  };

  // Update id and add bounce on link click for 1500ms(2 bounces)
  cafeLinkClick = (id, cafe) => {
    this.setState({ id });
    const google = this.props.google;
    // Set other markers to invisible
    this.deleteMarkers(cafe);
    cafe.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      cafe.marker.setAnimation(null);
    }, 1500);
  };
  //Get cafe's details if not already in this.state.cafeDetails
  updateCafesDetails = () => {
    if (!(this.state.id in this.state.cafesDetails)) {
      getCafeDetails(this.state.id)
        .then(results => {
          const updatedDetails = Object.assign({}, this.state.cafesDetails);
          updatedDetails[this.state.id] = results;
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
    cafe.marker.setAnimation(null);
  };
  render() {
    const style = {
      // Specify dimensions of the Google map
      height: '100%'
    };
    return (
      // Wrap the DOM in Router
      <Router>
        <div className="container">
          <header className="title-container">
            <button type="button" className="hamburger-btn" onClick={this.clickToggle}>
              <FontAwesomeIcon icon={faBars} />
            </button>
            <h1 className="title">Kbh Cafes</h1>
            {/*Handle a fail from Foursquare API*/}
            {this.state.apiRequestFailed && (
              <div>We are sorry. The API request to Foursquare has failed. Please try again later.</div>
            )}
          </header>
          <main className="main-content">
            <section className={this.state.toggle ? 'search-container toggle' : 'search-container'}>
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
            </section>
            <section className="map-container">
              {/* Return a div with ref='map' and style.*/}
              <div className="map" ref="map" role="application" style={style}>
                loading map...
              </div>
            </section>
          </main>
        </div>
      </Router>
    );
  }
}
