import React, { Component } from 'react';
import './App.css';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { getCafeDetails } from './Api/yelpApi';

export default class SearchBar extends Component {
  render() {
    const { google, matchedResults, updateID, markerBounce, stopBounce } = this.props;
    return (
      <div>
        <ul className="search-results">
          {matchedResults.map(result => (
            <li>
              {/*We need to bind this in order to refer to the scope of MapContainer*/}
              <Link
                to={`details/${result.id}`}
                onClick={updateID.bind(this, result.id, result)}
                onMouseEnter={markerBounce.bind(this, result)}
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
          //       <Link to={`details/${result.id}`} onClick={updateID.bind(this, result.id, result)}>
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
