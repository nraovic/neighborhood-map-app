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

export default class MapContainer extends Component {
  // ======================
  // ADD LOCATIONS TO STATE
  // ======================
  state = {
    results: [],
    query: '',
    id: window.location.href.substring(window.location.href.lastIndexOf('/') + 1),
    cafesDetails: {},
    redirect: false,
    animation: false
  };
  //markers = [];
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

      // ==================
      // ADD MARKERS TO MAP
      // ==================
      //Set state for the results that have
      getData().then(results => {
        for (let result of results) {
          const image = { size: new google.maps.Size(20, 32) };
          result['marker'] = new google.maps.Marker({
            // creates a new Google maps Marker object.
            position: { lat: result.location.lat, lng: result.location.lng },
            map: this.map,
            title: result.name, //url: `/details/${result.id}`,
            id: result.id,
            animation: null
          });
          const animation = this.state.animation;
          console.log(animation);
          if (animation) {
            if (result.marker.getAnimation() !== null) {
              result.marker.setAnimation(null);
            } else {
              result.marker.setAnimation(google.maps.Animation.BOUNCE);
            }
            result['infoWindow'] = new google.maps.InfoWindow({
              content: `<h3>${result.name}</h3>`
            });
          }
          /*result['infoWindow'] = new google.maps.InfoWindow({
            content: `<h3>${result.name}</h3>`
          });*/
          result.marker.addListener('click', this.markerClick.bind(this, result.id), false);
          //   // result.infoWindow.open(this.map, result.marker);
          //   //this.update(result.id, result);
          //   //window.location.href = `/details/${result.id}`;
          // });
        }
        this.setState({
          results
        });
      });
    }
  }

  markerClick(id) {
    this.setState({ redirect: true, id: id });
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
    event.preventDefault();
    const query = event.target[0].value;
    this.setState({
      query: query
    });
  };
  bounceMarker = cafe => {
    const google = this.props.google;
    cafe.marker.setAnimation(google.maps.Animation.BOUNCE);
  };
  endBounce = cafe => {
    const google = this.props;
    cafe.marker.setAnimation(null);
  };
  updateID = (id, cafe) => {
    this.setState({ id: id, animation: true });
    const google = this.props.google;
    cafe.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      cafe.marker.setAnimation(null);
    }, 1500);
    //cafe.infoWindow.open(this.map, cafe.marker);
    /*if (cafe.marker.getAnimation() !== null) {
      cafe.marker.setAnimation(null);
    } else {
      cafe.marker.setAnimation(google.maps.Animation.BOUNCE);
    }*/
    /*for (let marker of this.markers) {
      console.log(marker.position.lat());
      console.log(cafe.location.lat);
      if (marker.position.lat() === cafe.location.lat) {
        console.log(cafe);
        marker.animation = this.props.google.maps.Animation.DROP;
      }
    }*/
  };
  updateCafesDetails = () => {
    if (!(this.state.id in this.state.cafesDetails)) {
      getCafeDetails(this.state.id).then(results => {
        const updatedDetails = Object.assign({}, this.state.cafesDetails);
        updatedDetails[this.state.id] = results;
        console.log(updatedDetails);
        this.setState({ cafesDetails: updatedDetails });
      });
    }
  };
  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect from={`/details/${this.state.id}`} push to={`/details/${this.state.id}`} />;
      // <Router path="/details" render={() => <Redirect push to={`/details/${this.state.id}`} />} />;
    }
  };
  render() {
    const url = window.location.href;
    console.log(url);
    console.log(url.substring(url.lastIndexOf('/') + 1));

    const style = {
      // MUST specify dimensions of the Google map or it will not work. Also works best when style is specified inside the render function and created as an object
      height: '100vh' // 75vh similarly will take up roughly 75% of the height of the screen. px also works.
    };
    const { google } = this.props; // sets props equal to google
    const maps = google.maps; // sets maps to google maps props

    //Clear the markers from the map
    /*for (let marker of this.markers) {
      marker.setMap(null);
    }
    this.markers = [];*/
    const matchedResults = this.getMatchedResults();
    return (
      // in our return function you must return a div with ref='map' and style.
      <Router>
        <div className="container">
          {console.log(this.state.query)}
          <div className="search-container">
            <Route
              exact
              path="/"
              render={() => (
                <SearchBar
                  updateID={this.updateID}
                  google={this.props.google}
                  stopBounce={this.endBounce}
                  markerBounce={this.bounceMarker}
                  matchedResults={matchedResults}
                  updateQuery={this.updateQuery}
                />
              )}
            />
            {this.renderRedirect()}
            <Route
              path={`/details/${this.state.id}`}
              render={() => (
                <RestaurantDetails
                  idUrl={this.state.id}
                  redirect={this.state.redirect}
                  cafesDetails={this.state.cafesDetails}
                  updateID={this.updateID}
                  updateCafesDetails={this.updateCafesDetails}
                />
              )}
            />

            {/*and here its without the bracets */}
          </div>
          <div className="map-container">
            <div>
              {this.state.results.map(result => {
                // iterate through locations saved in state
                matchedResults.includes(result) ? result.marker.setVisible(true) : result.marker.setVisible(false);
                console.log(result);
                /*<Link to={`details/${result.id}`} onClick={this.updateID.bind(this, result.id, result)}>
                  result.marker
                </Link>;*/
                /*result.marker.addListener('click', function() {
                  this.updateID(result.id, result);
                  window.location.href = this.url;
                });*/
                // sets position of marker to specified location // sets markers to appear on the map we just created on line 35 // the title of the marker is set to the name of the location
                /*var infowindow = new google.maps.InfoWindow({ content: `<h3>${result.name}</h3>` });
                marker.addListener('click', function() {
                  infowindow.open(this.map, marker);
                });
                console.log(marker);*/
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
