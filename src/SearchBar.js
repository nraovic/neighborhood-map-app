import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

export default class SearchBar extends Component {
  render() {
    const { updateQuery, matchedResults, cafeLinkClick, startBounce, stopBounce } = this.props;
    const matched = matchedResults();
    return (
      <div className="search">
        <form className="search-form" onSubmit={updateQuery}>
          <input className="search-input" type="text" placeholder="Seach for a cafe" />
          <button className="filter-btn" type="submit">
            Filter
          </button>
        </form>
        <ul className="search-results">
          {matched.map(result => (
            <li key={result.id} className="cafe-link">
              {/*We need to bind this in order to refer to the scope of MapContainer*/}
              <Link
                to={`details/${result.id}`}
                onClick={cafeLinkClick.bind(this, result.id, result)}
                onMouseEnter={startBounce.bind(this, result)}
                onMouseLeave={stopBounce.bind(this, result)}
              >
                {result.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
