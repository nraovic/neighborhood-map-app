import React, { Component } from 'react';
import './App.css';
import { getCafeDetails } from './Api/yelpApi.js';
import update from 'immutability-helper';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

export default class RestaurantDetails extends Component {
  state = {
    cafesDetails: {}
  };
  updateCafesDetails = id => {
    if (!(id in this.state.cafesDetails)) {
      getCafeDetails(id).then(results => {
        const updatedDetails = Object.assign({}, this.state.cafesDetails);
        updatedDetails[id] = results;
        console.log(updatedDetails);
        this.setState({ cafesDetails: updatedDetails });
      });
    }
  };
  componentDidMount() {
    const { idUrl, redirect } = this.props;
    this.updateCafesDetails(idUrl);
  }
  render() {
    const { idUrl, getDetails } = this.props;
    const photoStyle = { maxWidth: '400px', maxHeight: '400px' };
    const url = window.location.href;
    const getIdfromUrl = url.substring(url.lastIndexOf('/') + 1);

    const photoUrl = url => {
      const photoUrl = `${this.state.cafesDetails[url].venue.bestPhoto.prefix}${
        this.state.cafesDetails[url].venue.bestPhoto.height
      }x${this.state.cafesDetails[url].venue.bestPhoto.width}${this.state.cafesDetails[url].venue.bestPhoto.suffix}`;
      return photoUrl;
    };
    return (
      <div>
        <Link to="/">Go to results</Link>
        {idUrl in this.state.cafesDetails && (
          <div>
            <h2>{this.state.cafesDetails[idUrl].venue.name}</h2>
            <a href={this.state.cafesDetails[idUrl].venue.url} target="_blank">
              <i className="fa fa-phone-square">{this.state.cafesDetails[idUrl].venue.url}</i>
            </a>
            <p>{this.state.cafesDetails[idUrl].venue.contact.phone}</p>
            <img src={photoUrl(idUrl)} style={photoStyle} />
          </div>
        )}
      </div>
    );
  }
}
