import React, { Component } from 'react';
import './App.css';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { getCafeDetails } from './Api/yelpApi';

export default class SearchBar extends Component {
  render() {
    const { google, updateQuery, matchedResults, cafeLinkClick, startBounce, stopBounce } = this.props;
    const matched = matchedResults();
    console.log(matched)
    return (
      <div>
        <form className="seach-form" onSubmit={updateQuery}>
          <input className="search-input" type="text" placeholder="Seach for a cafe" />
          <button className="filter-btn" type="submit">Filter</button>
        </form>
        <ul className="search-results">
          {matched.map(result => (
            <li className="cafe-link">
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
        {
          // {matchedResults.map(result => {
          //   result.marker.addListener('click', function() {
          //     <li>
          //       <Link to={`details/${result.id}`} onClick={cafeLinkClick.bind(this, result.id, result)}>
          //         {result.marker}
          //       </Link>
          //     </li>;
          //   });
          // })}
        }
      </div>
    );
  }
}
