## Project Description

A single page application that list cafes in central Copenhagen. The listing and details about each cafe are obtained from Foursquare API and are displayed on the map by the Google Maps API. 
The app is build with the React Framework using the React-Create-App starter.
A hosted version of the app https://nraovic.github.io/neighborhood-map-app/

## How to Use the App

The main page shows a listing and a map of the cafes in the central area of Copenhagen. It is possible to search for and filter specific cafes. By clicking on either a cafe's link or its marker, details about the cafe will be displayed in the sidebar.

## How to Run the App 
You can run the app in the Development or Production mode. Note that the Service Worker will work only in the Production Mode.

### Development Mode

1. To run the project you need [Node.js](https://nodejs.org/en/) installed. 
2. Once node installed, clone this repo by running git clone https://github.com/nraovic/neighborhood-map-app
3. Now run ```npm install``` to install all dependances
3. Launch the app by running ```npm start```

Your browser should automatically run the app, otherwise navigate to http://localhost:3000/

### Production Mode

1. To run the app in the production mode, first run ```npm run build```
2. When the application is ready to be deployed at the gh page, run ```npm run deploy```

You can see the demo at https://nraovic.github.io/neighborhood-map-app/