import React, { Component } from 'react';
import './App.css';
import { getCafeDetails } from './Api/yelpApi.js';
import update from 'immutability-helper';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faGlobe, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

export default class RestaurantDetails extends Component {
  state = {};
  componentWillMount() {
    const { idUrl, updateCafesDetails } = this.props;
    updateCafesDetails(idUrl);
  }
  render() {
    const { idUrl, cafesDetails, apiRequest } = this.props;
    const photoStyle = { maxWidth: '400px', maxHeight: '400px' };
    // Get url for the cafe's photo
    const photoUrl = url => {
      const photoUrl = `${cafesDetails[url].venue.bestPhoto.prefix}${cafesDetails[url].venue.bestPhoto.height}x${
        cafesDetails[url].venue.bestPhoto.width
      }${cafesDetails[url].venue.bestPhoto.suffix}`;
      return photoUrl;
    };
    // Define all data to be listed in the Details section.
    let cafe, name, description, address, phone, currentlyOpen, timeFrames, rating, likes, websiteUrl;
    if (idUrl in cafesDetails) {
      cafe = cafesDetails[idUrl].venue;
      console.log(cafe);
      name = cafe.name;
      description = cafe.description;
      address = cafe.location.address;
      phone = cafe.contact.formattedPhone;
      if (cafe.popular && cafe.popular.isOpen) {
        currentlyOpen = 'Open';
      } else {
        currentlyOpen = 'Closed';
      }
      rating = `${cafe.rating}/10`;
      websiteUrl = cafe.url;
      // Parse the url to get the part after the 'www' if it has it or after '/'
      // TO DO: Do this with regex
      websiteUrl && (websiteUrl.includes('www') ? (websiteUrl = websiteUrl.substr(websiteUrl.indexOf('.') + 1)) : (websiteUrl = websiteUrl.substr(websiteUrl.lastIndexOf('/') + 1))); 
      if (cafe.popular && cafe.popular.timeframes) {
        timeFrames = cafe.popular.timeframes;
      }
    }
    return (
      <div>
        <Link to="/">Go to results</Link>
        {/*Handle a fail from Foursquare API*/}
        {apiRequest && (
          <div>We are sorry. We could not get the data about the Cafe from Foursquare. Please try again later.</div>
        )}
        {/*Check first if the data has been updated in Cafe Details*/}
        {idUrl in cafesDetails && (
          <div>
            <h2>{name}</h2>
            <p>{description}</p>
            {websiteUrl && (
              <a href={websiteUrl} target="_blank">
                <FontAwesomeIcon icon={faGlobe} />
                {websiteUrl}
              </a>
            )}
            {phone && (
              <p>
                <FontAwesomeIcon icon={faPhone} />
                {phone}
              </p>
            )}
            {address && (
              <p>
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                {address}
              </p>
            )}
            <p>Rating: {rating}</p>
            <p>Hours: {currentlyOpen}</p>
            {/*Extract the opening hours by days*/}
            <div>
              {timeFrames && timeFrames.map(frame => (
                <div>
                  <span>{frame.days}</span>
                  {frame.open.map(time => <span>{time.renderedTime}</span>)}
                </div>
              ))}
            </div>
            <img src={photoUrl(idUrl)} style={photoStyle} />
          </div>
        )}
      </div>
    );
  }
}
