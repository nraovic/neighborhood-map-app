## Project Description
Single page application that provides a list of all Cafes in central Copenhagen. The listing and details about each cafe is obtained from Foursquare API and its displayed on the map by the Google Maps API. 
The app is build with the React Framework using the React Create App.

## How to Use the App

The main page shows a listing and a map of the cafes in the central area of Copenhagen. It is possible to search for and filter specific cafes. By clicking on either the cafe's link or its marker, details about the cafe will be displayed in the sidebar.

## How to Run the App 
You can run the app in the Development or Production mode. The Service Worker will work only in the Production Mode.

### Development Mode

1. To run the project you need [Node.js](https://nodejs.org/en/) installed. 
2. Once node installed, clone this repo by running git clone https://github.com/nraovic/neighborhood-map-app
3. Now run ```npm install``` to install all dependances
3. Launch the app by running ```npm start```

Your browser should automatically run the app, otherwise navigate to http://localhost:3000/

### Production Mode

1. To run the app in the production mode, first run ```npm run build```
2. When the application is ready to be deployed, run ```serve -s build```

The page will be hosted at http://localhost:5000/