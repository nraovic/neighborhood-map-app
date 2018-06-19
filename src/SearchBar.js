import React, { Component } from 'react';
import './App.css';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { getCafeDetails } from './Api/yelpApi';

export default class SearchBar extends Component {
  render() {
    const { matchedResults, updateID } = this.props;
    return (
      <ul className="search-results">
        {matchedResults.map(result => (
          <li>
            {/*We need to bind this in order to refer to the scope of MapContainer*/}
            <Link to={`details/${result.id}`} onClick={updateID.bind(this, result.id, result)}>
              {result.name}
            </Link>
          </li>
        ))}
      </ul>
    );
  }
}
