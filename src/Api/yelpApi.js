// Get data about all cafes in the area
import sortBy from 'sort-by';
export const getData = () => {
  const lat = 55.6837;
  const lng = 12.5716;
  const category = '4bf58dd8d48988d16d941735';
  const clientID = 'KSYTULHQ5XLXG50K5QSS130TNGE2NI5101MA3UZEPYXFKWE0';
  const clientSecret = 'XU4FTER2VWNJXAYBGWTJN120GFOWSJ3HYW2JGCQE0AE3W1M4';
  return fetch(
    `https://api.foursquare.com/v2/venues/search?ll=${lat},${lng}&client_id=TAMFSSUQNJSMYX5LVDQV0SNKJ0JRIFSY0ZTHM4O3EUMPRASY&client_secret=JF5QH00NJSD02POAPXJFNQLOEXHXQQQTHSASAAKELFENSVXE&&v=20180518&categoryId=${category}&radius=1000&limit=50`
  )
    .then(response => {
      if (!response.ok) {
        throw Error(response.statusText);
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
    `https://api.foursquare.com/v2/venues/${ID}?client_id=TAMFSSUQNJSMYX5LVDQV0SNKJ0JRIFSY0ZTHM4O3EUMPRASY&client_secret=JF5QH00NJSD02POAPXJFNQLOEXHXQQQTHSASAAKELFENSVXE&v=20180518`
  )
    .then(response => {
      if (!response.ok) {
        throw Error(response.statusText);
      } else {
        return response.json();
      }
    })
    .then(data => {
      const venueDetails = data.response;
      return venueDetails;
    });
};
