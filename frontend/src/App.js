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


  const position = {lat: 51, lng: 9};
  const [data, setData] = useState([10,10]);
  const childToParent = (childdata) => {
    setData(childdata);
    console.log(data);
  }


  //const position2 = {late: 53, lng: 9};




  const [map, setMap] = useState((null))
  const [dResponse, setDResponse] = useState(null)
  const [travelTime, setTravelTime] = useState('')
  const [distance, setDistance] = useState('')
  const destinationRef = useRef()
  const originRef = useRef()
  const travelMethodRef = useRef()


  //destinationRef = position
  //originRef = position2


  return (
 
    <APIProvider apiKey =  {process.env.REACT_APP_API_KEY}>
      <div className="App">
        <header className="App-header">
          <h>NuCasa</h>
          <button onClick ={findRoute}>testDirections</button>
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


  async function findRoute() {
    const position2 = new google.maps.LatLng(53.5, 9.8);


    const {DirectionsService} = await google.maps.importLibrary("routes")
   
    const dService = new DirectionsService
   
    const result = await dService.route({
     
      destination: position,
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