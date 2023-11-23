"use client";


import React, {useRef, useState} from "react";
//import * as React from 'react';


import {
  APIProvider,
  useDirectionService,
  useApiIsLoaded,
  Map,
  AdvancedMarker,
useMapsLibrary,
  Pin,
  InfoWindow,
  AutocompleteProps,
} from "@vis.gl/react-google-maps"


import Multiple from "./components/Form.js";


const google = window.google


export default function App() {
   
  /*
  const isLoaded  = useApiIsLoaded({
    googleMapsApiKey: process.env.REACT_APP_API_KEY,
    libraries: ["places"],
  });


  if (!isLoaded) return <div>Loading...</div>;
  return <MapA />;
}


function MapA() {
*/


  // const position = {lat: 51, lng: 9}; 
  const [position, setPosition] = useState({lat: 51, lng: 9});
    // const [data, setData] = useState(10); passes all data from from to map
  const [data, setData] = useState({car: "",walk: "",bus: "",add1: 10,add2: 40,add3: "",add4: "",add5: ""});

  const childToParent = (childdata) => {
    setData(childdata);
    console.log(data);
  }





  const [map, setMap] = useState((null))
  const [dResponse, setDResponse] = useState(null)
  const [travelTime, setTravelTime] = useState('')
  const [distance, setDistance] = useState('')
  const destinationRef = useRef()
  const originRef = useRef()
  const travelMethodRef = useRef()


  //destinationRef = position
  //originRef = position2
//{process.env.REACT_APP_API_KEY}

  return (
 
    <APIProvider apiKey =  "AIzaSyCF_DLds_klTXOc8ot-lpUhqdDrHMQ1s_4">
      <div className="App">
        <header className="App-header">
          <h>NuCasa</h>
          <button onClick ={() =>findRoute(data)}>testDirections</button>
        </header>
      </div>
     
      <div class="split left-panel ">
        <Multiple childToParent={childToParent}/>
          <p>{childToParent}</p>
          <button primary onClick={() => childToParent(data)}>Click Child</button>
      </div>


      <div class="split right-panel " style = {{height: "97vh"} }>
        <Map zoom = {9} center = {position} onLoad={map => setMap(map)}>
        </Map>
      </div>
    </APIProvider>
  );
//onLoad={map => setMap(map)}






  function useDirectionsRenderer({dService}) {
    const isLoaded  = useApiIsLoaded({
      googleMapsApiKey: process.env.REACT_APP_API_KEY,
      libraries: ["places"],
    });
 
   
    const position2 = new google.maps.LatLng(53.5, 9.8);

    
    const directionsRenderer = useMapsLibrary('directionsRenderer');
    directionsRenderer.setMap(map);
    const request = dService.route({
      travelMode: 'DRIVING',
      destination: position,
      origin: position2,
    })
    dService.route(request, function(result, status) {
      if (status == 'OK') {
        directionsRenderer.setDirections(result);
      }
    });
  }


  async function findRoute(data) {
    // const position2 = new google.maps.LatLng(53.5, 9.8);
    const position1 = new google.maps.LatLng(data.add1,data.add1);
    const position2 = new google.maps.LatLng(data.add2,data.add2);

    //UNSUCESSFUL: TRYING to manipulate visual of map based on positon, ideally this will be the optimal living location
    // setPosition({lat: data.add1, lng: 9});

    const {DirectionsService} = await google.maps.importLibrary("routes")
   
    const dService = new DirectionsService //added() here idk why it worked
   
    const result = await dService.route({
     
      destination: position1,
      origin: position2,
      travelMode: 'DRIVING',
    })


    setDistance(result.routes[0].legs[0].distance.text)
    setTravelTime(result.routes[0].legs[0].duration.text)
    console.log(distance)
    console.log(travelTime)
   
  }


}

window.App= App;