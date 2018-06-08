import React, { Component } from 'react';
import './App.css';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

export default class SearchBar extends Component {
  render() {
    const { matchedResults } = this.props;
    return (
      <ul className="search-results">
        {matchedResults().map(result => (
          <li>
            <Link to="/details">{result.name}</Link>
          </li>
        ))}
      </ul>
    );
  }
}
