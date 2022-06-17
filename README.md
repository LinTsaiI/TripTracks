# TripTracks

TripTracks is a travel planner based on interaction with Google Map Services. It provides an intuitive operation experience to easily search places, adds places to the list of interest, and manipulate the order of the itinerary.

![](https://i.imgur.com/zeADE9o.png)

:link:Demo: https://triptracks-tw.web.app/

:bust_in_silhouette:Test account:

| Account         | Password |
| --------------- | -------- |
| test@gmail.com  | testtest |

&nbsp;
## Table of Content

* [Front-end Technique](#-front-end-technique)
    * [Tech Stack](#tech-stack)
    * [React](#react)
        * [Component Structure](#component-structure)
    * [React Router](#react-router)
    * [Redux Toolkit](#redux-toolkit)
    * [Webpack & Babel](#webpack--babel)
* [Back-end Technique (Firebase Cloud Services)](#-back-end-technique-firebase-cloud-services)
    * [Firebase Authentication](#firebase-authentication)
    * [Cloud Firestore](#cloud-firestore)
    * [Firebase Storage](#firebase-storage)
    * [Firebase Hosting](#firebase-hosting)
* [Third Party Library](#-third-party-library)
    * [Google Maps JavaScript API](#google-maps-javascript-api)
* [Main Features](#-main-features)
* [Contact](#contact)


## ✤ Front-end Technique

### Tech Stack
![](https://i.imgur.com/9BJ0GbQ.png)

### React
* SPA with functional components.
* Used hooks: `useState`, `useEffect`, `useRef`, `useContext`.
#### Component Structure:
&nbsp;
 ![](https://i.imgur.com/saZ9WyB.png)

### React Router
* version: 6
* Handle the SPA routing.

### Redux Toolkit
* Manage the global states shared with multiple components.
* Use `createAsyncThunk` to handle async interactions with the database.

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
&nbsp;
 ![](https://i.imgur.com/3A3nQ2i.png)

### Firebase Storage
* Host images uploaded from users.

### Firebase Hosting
* Host the static content of the project.


## ✤ Third Party Library

### Google Maps JavaScript API
No React packages are used like react-google-maps other than the official [@googlemaps/js-api-loader](https://www.npmjs.com/package/@googlemaps/js-api-loader) for loading Google Maps API script.
* Direction Service
* Geometry Library
    * poly
* Places Library
    * Find Place from Query
    * Nearby Search
    * Place Details requests
    * Places Autocomplete

## ✤ Main Features
### User Authentication
* Sign up / sign in locally or with Google via Firebase Authentication.

### Trip Plan Management System Design
* Manage trip plans by creating separate cards. Each trip card can hold itineraries of the trip displayed on the map that you can search places on it and add to the list of interest.
* Switch to different days to plan and manage the itinerary in the trip planner page. The itinerary of one day is an independent map. The trip data is hosted by **Cloud Firestore**.
* The places you saved of the day will show on the map as markers and generate the connected line automatically between places based on their order.
* Each trip you established will display on the map of the profile page as a flag. Just like the track and achievements you've traveled. Hover to see the tirp name and click to navigate to the trip planner page.

### Searching Places
* Support 3 ways for searching places:
    * Search on the search box. This feature applies **Place Autocomplete** and **Find Place From Query** of Google Map JavaScript API.
    &nbsp;
     ![](https://i.imgur.com/WBKYreL.gif)
     
    * Click a place on the map directly. This feature applies **Place Details requests** of Google Map JavaScript API.
    &nbsp;
     ![](https://i.imgur.com/WBKYreL.gif)
     
    * Choose one of the six place types supported then drag and drop to draw a custom searching area on the map. This feature integrates **Polyline** and **Polygon** overlay to define the area for searching, and return the match places inside the area by applying **Nearby Search** of Google Map JavaScript API.
    &nbsp;
     ![](https://i.imgur.com/NxrECBj.gif)

### Interaction with Places on the List of Interest
* Drag and drop the place on the list can change the order of the itinerary and re-render the view on the map synchronically. (Note: Currently support desktop and laptop only.
&nbsp;
![](https://i.imgur.com/AGQSFC2.gif)

* When more than two places have been added to the list, the estimated distance and time between them will show up by Google Map **Direction Service**. The default mode is driving and also supports transportation and walking options.
&nbsp;
 ![](https://i.imgur.com/GtfLr0t.gif)

* Users can have some notes on every place saved on the list. The note data is hosted by **Cloud Firestore**.
&nbsp;
 ![](https://i.imgur.com/At8mKhr.gif)

### Others
* Can change the username and avatar. The user data is hosted by **Cloud Firestore** and **Firebase Storage** separately.
* Implement RWD to support mobile devices. (Note: The drag and drop feature for changing the order of places currently supports desktop and laptop only.)

## Contact

* :blush:Developer: Tsai-I, Lin
* :link:LinkedIn: [https://www.linkedin.com/in/lintsaii/](https://www.linkedin.com/in/lintsaii/)
* :clipboard:CV: [https://drive.google.com/file/d/1SrHYTeOatKB19YcoUtamujJDEt_Jflfs/view?usp=sharing](https://drive.google.com/file/d/1SrHYTeOatKB19YcoUtamujJDEt_Jflfs/view?usp=sharing)
* :mailbox:Email: alicelin9326@gmail.com
