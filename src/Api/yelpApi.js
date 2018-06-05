export const getData = () => {
  return fetch(
    'https://api.foursquare.com/v2/venues/search?ll=55.6617,12.5168&client_id=KSYTULHQ5XLXG50K5QSS130TNGE2NI5101MA3UZEPYXFKWE0&client_secret=RCZ5RJCKUGHPYDGUL2PZJYEVEWP5SEY2ZXUWB1RPJOMFEAXD&&v=20180518&categoryId=4bf58dd8d48988d16d941735&radius=1000&limit=50'
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
      console.log(places);
      return places;
    });
};
