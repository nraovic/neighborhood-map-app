// Get data about all cafes in the area
import sortBy from 'sort-by';
const lat = 55.6837;
const lng = 12.5716;
const category = '4bf58dd8d48988d16d941735';
const clientID = 'TAMFSSUQNJSMYX5LVDQV0SNKJ0JRIFSY0ZTHM4O3EUMPRASY';
const clientSecret = 'JF5QH00NJSD02POAPXJFNQLOEXHXQQQTHSASAAKELFENSVXE';
const version = '20180518';
const radius = '1000';
const limit = '50';
export const getData = () => {
  return fetch(
    `https://api.foursquare.com/v2/venues/search?ll=${lat},${lng}&client_id=${clientID}&client_secret=${clientSecret}&&v=${version}&categoryId=${category}&radius=${radius}&limit=${limit}`
  )
  /* If without throw response, the first then would resolve(with ok status set to false) but the second then would fail on line 25
     If throw response, the second or any later then would not fullfil, so the app would upload but without results
     If throw response AND catch, the catch would resolve and the page would not upload
  */
    .then(response => {
      if (!response.ok) {
        window.alert('Sorry, data is not available at the moment')
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
    })
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
