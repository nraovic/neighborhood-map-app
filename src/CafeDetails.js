import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faGlobe, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import './App.css';

export default class CafeDetails extends Component {
  state = {};
  componentWillMount() {
    const { idUrl, updateCafesDetails } = this.props;
    updateCafesDetails(idUrl);
  }
  render() {
    const url = process.env.PUBLIC_URL + '/';
    const { idUrl, cafesDetails, apiRequest } = this.props;
    // Get url for the cafe's photo
    const photoUrl = url => {
      const photoUrl = `${cafesDetails[url].venue.bestPhoto.prefix}${cafesDetails[url].venue.bestPhoto.height}x${
        cafesDetails[url].venue.bestPhoto.width
      }${cafesDetails[url].venue.bestPhoto.suffix}`;
      return photoUrl;
    };
    // Define all data to be listed in the Details section.
    let cafe, name, description, address, phone, currentlyOpen, timeFrames, rating, websiteUrl, foursquareUrl;
    if (idUrl in cafesDetails) {
      cafe = cafesDetails[idUrl].venue;
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
      foursquareUrl = cafe.canonicalUrl;
      // Parse the url to get the part after the 'www' if it has it or after '/'
      // TO DO: Do this with regex
      websiteUrl &&
        (websiteUrl.includes('www')
          ? (websiteUrl = websiteUrl.substr(websiteUrl.indexOf('.') + 1))
          : (websiteUrl = websiteUrl.substr(websiteUrl.lastIndexOf('/') + 1)));
      if (cafe.popular && cafe.popular.timeframes) {
        timeFrames = cafe.popular.timeframes;
      }
    }
    return (
      <div className="details" role="complementary">
        <Link className="back-link" to={url}>
          Go back to results
        </Link>
        {/*Handle a fail from Foursquare API*/}
        {apiRequest && (
          <div className="request-fail" role="alert">
            We are sorry. We could not get the data about the Cafe from Foursquare. Please try again later.
          </div>
        )}
        {/*Check first if the data has been updated in Cafe Details*/}
        {idUrl in cafesDetails && (
          <div className="details">
            <h2 className="cafe-name">{name}</h2>
            <p className="cafe-description">{description}</p>
            {websiteUrl && (
              <a href={websiteUrl} target="_blank" className="cafe-url">
                <FontAwesomeIcon icon={faGlobe} className="font-awesome" />
                <span>{websiteUrl}</span>
              </a>
            )}
            {phone && (
              <p className="cafe-phone">
                <FontAwesomeIcon icon={faPhone} className="font-awesome" />
                <span>{phone}</span>
              </p>
            )}
            {address && (
              <p className="cafe-address">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="font-awesome" />
                <span>{address}</span>
              </p>
            )}
            {rating && (
              <p className="cafe-rating">
                Rating: <span>{rating}</span>
              </p>
            )}
            <img alt={`Café ${name}`} src={photoUrl(idUrl)} style={{ width: '100%' }} className="cafe-img" />

            {currentlyOpen && (
              <p className="cafe-open">
                Hours: <span>{currentlyOpen}</span>
              </p>
            )}
            {/*Get the opening hours by days*/}
            <div className="cafe-hours">
              {timeFrames &&
                timeFrames.map((frame, index) => (
                  <div key={index}>
                    <span className="cafe-days">{frame.days}:</span>
                    {frame.open.map((time, index) => (
                      <span key={index} className="cafe-times">
                        {time.renderedTime}
                      </span>
                    ))}
                  </div>
                ))}
            </div>
            <p className="foursquare-link">
              The info aboout the cafe has been obtained from Foursquare. For more details please visit
              <a href={foursquareUrl} target="_blank" style={{ color: '#8ac6ef' }}>
                the Foursquare Page
              </a>
            </p>
          </div>
        )}
      </div>
    );
  }
}
