import React, { Component } from 'react';
import './App.css';
import { getCafeDetails } from './Api/yelpApi.js';
import update from 'immutability-helper';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

export default class RestaurantDetails extends Component {
  componentDidMount() {
    const { idUrl } = this.props;
    this.props.updateCafesDetails();
  }

  render() {
    const { idUrl, getDetails } = this.props;
    return (
      <div>
        <Link to="/">Go to results</Link>
        <p>Restaurant Details</p>
        {idUrl in this.props.cafesDetails && <p>{this.props.cafesDetails[idUrl].venue.id}</p>}
      </div>
    );
  }
}
