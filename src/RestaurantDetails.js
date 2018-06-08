import React, { Component } from 'react';
import './App.css';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { getData } from './Api/yelpApi.js';
import escapeRegExp from 'escape-string-regexp';

export default class RestaurantDetails extends Component {
  // ======================
  // ADD LOCATIONS TO STATE
  // ======================
  render() {
    return (
      <div>
        <Link to="/">Go to results</Link>
        <p>Restaurant Details</p>
      </div>
    );
  }
}
