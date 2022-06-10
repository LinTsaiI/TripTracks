# TripTracks

TripTracks is a travel planner based on interaction with Google Map Services. It provides an intuitive operation experience to easily search places, adds places to the list of interest, and manipulate the order of the itinerary.

![](https://i.imgur.com/NDzE3Fv.png)


## Table of Content

* [Front-end Technique](#frontend)
    * [Tech Stack](#tech-stack)
    * [React](#react)
        * [Component Structure](#component-structure)
    * [React Router](#react-router)
    * [Redux Toolkit](#redux)
    * [Webpack & Babel](#webpack&babel)
* [Back-end Technique (Firebase Cloud Services)](#backend)
    * [Firebase Authentication](#auth)
    * [Cloud Firestore](#firestore)
    * [Firebase Storage](#storage)
    * [Firebase Hosting](#hosting)
* [Third Party Library](#third-party)
    * [Google Maps JavaScript API](#google-map)
* [Main Features](#main-features)
* [Contact](#contact)


## <a name="#frontend">✤ Front-end Technique</a>

### <a name="#tech-stack">Tech Stack</a>
![](https://i.imgur.com/v2lATQ2.png)

### <a name="#react">React</a>
* SPA with functional components.
* Used hooks: useState, useEffect, useRef, useContext.
* <a name="#component-structure">Component Structure</a>:
 ![](https://i.imgur.com/b9OP6jK.png)

### <a name="#react-router">React Router</a>
* version: 6
* Handle the SPA routing.

### <a name="#redux">Redux Toolkit</a>
* Manage the global states shared with multiple components.
* Use createAsyncThunk to handle async interactions with the database.

### <a name="#webpack&babel">Webpack & Babel</a>
* Handle module bundling of the project.
* ES6 JavaScript syntax for browser compatibility.


## <a name="#backend">✤ Back-end Technique (Firebase Cloud Services)</a>
### <a name="#auth">Firebase Authentication</a>
* Sign in / sign up with email and password.
* Support Google sign in.

### <a name="#firestore">Cloud Firestore</a>
* Holds user data and trip data.
* Every trip plan, the itinerary of each day, and every single place the user saved has its own document id which helps manage and change the data.
 ![](https://i.imgur.com/3A3nQ2i.png)

### <a name="#storage">Firebase Storage</a>
* Host images uploaded from users.

### <a name="#hosting">Firebase Hosting</a>
* Host the static and dynamic content of the project.


## <a name="#third-party">✤ Third Party Library</a>

### <a name="#google-map">Google Maps JavaScript API</a>
* Direction Service
* Geometry Library
    * poly
* Places Library
    * Find Place from Query
    * Nearby Search
    * Place Details requests
    * Places Autocomplete

## <a name="#main-features">✤ Main Features</a>
* Sign up / sign in locally or with Google via Firebase Authentication.

* Manage trip plans by creating separate cards. Each trip card can hold itineraries of the trip displayed on the map that you can search places on it and add to the list of interest.

* Switch to different days to plan and manage the itinerary in the trip planner page. The itinerary of one day is just like an independent map. The trip data is hosted by Cloud Firestore.

* 3 ways to search places:
    * Search on the search box. This feature applies Place Autocomplete and Find Place From Query of Google Map JavaScript API.
     ![](https://i.imgur.com/WBKYreL.gif)
     
    * Click a place on the map directly. This feature applies Place Details requests of Google Map JavaScript API.
     ![](https://i.imgur.com/WBKYreL.gif)
     
    * Choose one of the six place types supported then drag and drop to draw a freehand area on the map. This feature integrates Polyline and Polygon overlay to define the area for searching, and return the match places inside the area by applying Place Details requests of Google Map JavaScript API.
     ![](https://i.imgur.com/NxrECBj.gif)

* The places you saved of the day will show on the map as markers and generate the connected line between places based on their order.

* Drag and drop the place on the list can change the order of the itinerary and re-render the view on the map. (Note: Currently support desktop and laptop only.)
![](https://i.imgur.com/AGQSFC2.gif)

* Giving the estimated distance and time between connected places by Google Map Direction Service. Supporting car, transportation and walking options.
 ![](https://i.imgur.com/GtfLr0t.gif)

* Can have some notes on every single place you saved. The note data is hosted by Cloud Firestore.
 ![](https://i.imgur.com/At8mKhr.gif)

* Each trip you established will display on the map of the profile page as a flag. Just like the track and achievements you've traveled. Hover to see the tirp name and click to navigate to the trip planner page.

* Change the username and avatar. The user data is hosted by Cloud Firestore and Firebase Storage separately.

* Support mobile devices by RWD. (Note: The drag and drop feature for changing the order of places currently supports desktop and laptop only.)

## <a name="#contact">Contact</a>

* Developer: Tsai-I, Lin
* LinkedIn: [www.linkedin.com/in/lintsaii](https://)
* Email: alicelin9326@gmail.com
