import React, { Component } from 'react';
import './App.css';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

export default class RestaurantDetails extends Component {

    
  render() {
    const { idUrl } = this.props;
    return (
      <div>
        <Link to="/">Go to results</Link>
        <p>Restaurant Details</p>
        <p>{idUrl}</p>
      </div>
    );
  }
}
