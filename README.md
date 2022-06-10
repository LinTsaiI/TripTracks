# TripTracks

TripTracks is a travel planner based on interaction with Google Map Services. It provides an intuitive operation experience to easily search places, add places to the list of interest, and manipulate the order of the itinerary.

![](https://i.imgur.com/NpKj4yK.png)


## Table of Content

* Front-end Technique
    * Project Structure
    * React (Hooks)
        * Component Structure
    * React Router
    * Redux Toolkit
* Back-end Technique (Firebase Cloud Services)
    * Firebase Authentication
    * Cloud Firestore
    * Firebase Storage
    * Firebase Hosting
* Third Party Library
    * Google Maps JavaScript API
* Main Features


## ✤ Front-end Technique

### Project Structure
![](https://i.imgur.com/v2lATQ2.png)

### React (hooks)
* SPA with functional components.
* Used hooks: useState, useEffect, useRef, useContext.
* Component Structure:
 ![](https://i.imgur.com/PH2o2jY.png)

### React Router
* version: 6
* Handle the SPA routing.

### Redux Toolkit
* Manage the global states shared with multiple components.
* Use createAsyncThunk to handle async interactions with the database.

### Webpack & Babel
* Handle module bundling of the project.
* ES6 JavaScript syntax for browser compatibility.


## ✤ Back-end Technique (Firebase Cloud Services)
### Firebase Authentication
* Sign in / sign up with email and password.
* Support Google sign in.

### Cloud Firestore
* Holds user data and trip data.
* Every trip plan, the itinerary of each day, and every single place the user saved has its own document id which helps manage and change the data.
 ![](https://i.imgur.com/3A3nQ2i.png)

### Firebase Storage
* Host images uploaded from users.

### Firebase Hosting
* Host the static and dynamic content of the project.


## ✤ Third Party Library

### Google Maps JavaScript API
* Direction
* Geometry Library
    * poly
* Places Library
    * Find Place from Query
    * Nearby Search
    * Place Details requests
    * Places Autocomplete

## ✤ Main Features
* Sign up / sign in locally or with Google via Firebase Authentication.

* Create and manage trip plans with separate cards. A trip card holds a map that you can search places on it and add to the list of interest.

* Switch to different days to plan and manage the itinerary. The itinerary of one day is just like an independent map.

* 3 ways to search places:
    * Search on the search box.
     ![](https://i.imgur.com/WBKYreL.gif)
     
    * Click a place on the map directly.
     ![](https://i.imgur.com/WBKYreL.gif)
     
    * Choose a place type then draw a freehand area on the map you want.
     ![](https://i.imgur.com/NxrECBj.gif)

* The places you saved of the day will display on the map and show the order and the connected line between places.

* Drag the place on the list can change the order of the itinerary and re-render the view on the map. (Note: Currently support desktop and laptop only.)
![](https://i.imgur.com/AGQSFC2.gif)

* Giving the estimated distance and time between connected places. Supporting car, transportation and walking options.
 ![](https://i.imgur.com/GtfLr0t.gif)

* Can have some notes on every single place you saved.
 ![](https://i.imgur.com/At8mKhr.gif)

* The trips you established will display on the map of the profile page as a flag. Just like the track and achievements you've traveled.

* Change the username and avatar you want.

* Mobile devices friendly.(Note: The drag and drop feature of the place for change the order of places currently supports desktop and laptop only.)

## Contact

* Developer: Tsai-I, Lin
* LinkedIn: [www.linkedin.com/in/lintsaii](https://)
* Email: alicelin9326@gmail.com
