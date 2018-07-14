// The data about the cafes and their details have been obtained from Foursquare

// Get data about all cafes in the area
import sortBy from 'sort-by';
const lat = 55.6837;
const lng = 12.5716;
const category = '4bf58dd8d48988d16d941735';
const clientID = 'BNO1VU3FZRNRJMY1IQP4YCBAORTKGV3IHYQL4VFK4YWXUV5Z';
const clientSecret = 'II5WR4ORSVK1QTETSEVFZFJKU1FTC1SUMX4U0PAFTMQGQ4WH';
const version = '20180518';
const radius = '1000';
const limit = '50';
export const getData = () => {
  return fetch(
    `https://api.foursquare.com/v2/venues/search?ll=${lat},${lng}&client_id=${clientID}&client_secret=${clientSecret}&&v=${version}&categoryId=${category}&radius=${radius}&limit=${limit}`
  )
    .then(response => {
      if (!response.ok) {
        throw response; //Upload the rest of the app without the data
      } else {
        return response.json();
      }
    })
    .then(data => {
      const places = data.response.venues;
      const onlyCafes = places.filter(
        place => place.categories[0].name === 'Café' || place.categories[0].name === 'Coffee Shop'
      ); //Get only data for these categories names (sometimes bakeries or restaurants are also included in the Cafe categoryID)
      onlyCafes.sort(sortBy('name'));
      return onlyCafes;
    });
};

//Get details about each cafe
export const getCafeDetails = id => {
  const ID = id;
  return fetch(
    `https://api.foursquare.com/v2/venues/${ID}?client_id=${clientID}&client_secret=${clientSecret}&v=${version}`
  )
    .then(response => {
      if (!response.ok) {
        throw response;
      } else {
        return response.json();
      }
    })
    .then(data => {
      const venueDetails = data.response;
      return venueDetails;
    });
};
