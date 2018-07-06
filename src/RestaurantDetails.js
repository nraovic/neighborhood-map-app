import React, { Component } from 'react';
import './App.css';
import { getCafeDetails } from './Api/yelpApi.js';
import update from 'immutability-helper';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

export default class RestaurantDetails extends Component {
  state = {};

  componentDidMount() {
    const { idUrl, redirect, updateCafesDetails } = this.props;
    updateCafesDetails(idUrl);
  }
  render() {
    const { idUrl, getDetails, cafesDetails, apiRequest } = this.props;
    const photoStyle = { maxWidth: '400px', maxHeight: '400px' };
    const url = window.location.href;
    const getIdfromUrl = url.substring(url.lastIndexOf('/') + 1);
    console.log(cafesDetails);
    const photoUrl = url => {
      const photoUrl = `${cafesDetails[url].venue.bestPhoto.prefix}${cafesDetails[url].venue.bestPhoto.height}x${
        cafesDetails[url].venue.bestPhoto.width
      }${cafesDetails[url].venue.bestPhoto.suffix}`;
      return photoUrl;
    };
    return (
      <div>
        <Link to="/">Go to results</Link>
        {/*Handle a fail from Foursquare API*/}
        {apiRequest && (
          <div>We are sorry. We could not get the data about the Cafe from Foursquare. Please try again later.</div>
        )}
        {idUrl in cafesDetails && (
          <div>
            <h2>{cafesDetails[idUrl].venue.name}</h2>
            <a href={cafesDetails[idUrl].venue.url} target="_blank">
              <i className="fa fa-phone-square">{cafesDetails[idUrl].venue.url}</i>
            </a>
            <p>{cafesDetails[idUrl].venue.contact.phone}</p>
            <img src={photoUrl(idUrl)} style={photoStyle} />
          </div>
        )}
      </div>
    );
  }
}
