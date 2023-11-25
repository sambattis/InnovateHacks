"use client";
import {createRoot} from 'react-dom/client';
import './App.css';

import React, {useRef, useState} from "react";
//import * as React from 'react';
import {
  APIProvider,
  useDirectionService,
  useApiIsLoaded,
  useAutocomplete,
  Marker,
  Map,
  AdvancedMarker,
  useDirectionsRenderer,
useMapsLibrary,
  Pin,
  InfoWindow,
  AutocompleteProps,
} from "@vis.gl/react-google-maps"

import Multiple from "./components/Form.js";

const google = window.google

export default function App() {

  const [selected, setSelected] = useState(null);

  const [position, setPosition] = useState({lat: 51, lng: 10});
  const [data, setData] = useState({car: "",walk: "",bus: "",coX: 10,coY: 10,coX1: 10,coY1: 10,coX2: 10, coY2: 10});

  const childToParent = (childdata) => {
    setData(childdata);
    console.log(data);
  }

  const [map, setMap] = useState((null))
  const [dResponse, setDResponse] = useState(null)
  const [travelTime, setTravelTime] = useState('')
  const [distance, setDistance] = useState('')
  const [drivingPref, setDrivingPref] = useState('')
  const [bikePref, setBikePref] = useState('')
  const [walkPref, setWalkPref] = useState('')
  const destinationRef = useRef()
  const originRef = useRef()
  const travelMethodRef = useRef()

  const Place = function(xCo, yCo, freq) {
    const xCo_ = xCo;
    const yCo_ = yCo;
    const freq_ = freq;
    return { xCo_, yCo_, freq_ };
  };

  const PlaceOne = Place("3", "H");
  

  //destinationRef = position
  //originRef = position2
//

  return (
    
    <APIProvider apiKey = "AIzaSyCF_DLds_klTXOc8ot-lpUhqdDrHMQ1s_4">

      <div className="App">
        <header className="App-header">
          <h>NuCasa</h>
          <button onClick ={() =>findRouteHelper(data)}>testDirections</button>
        </header>
      </div>
     
      <div class="split left-panel ">
        <Multiple childToParent={childToParent}/>
          <p>{childToParent}</p>
          <button primary onClick={() => childToParent(data)}>Click Child</button>
      </div>


      <div class="split right-panel " style = {{height: "97vh"} }>
        <Map zoom = {9} center = {position} onLoad={map => setMap(map)}>
        {dResponse && (
            <useDirectionsRenderer directions={dResponse} />
          )}
        <Marker position={position} />
        </Map>
      </div>
    </APIProvider>
    
  );
//onLoad={map => setMap(map)}



function calculateStrength(xCo, yCo) {
  const totalScore = 0;
 //findRoute(xCo, yCo, xCo1, yCo1, car) * carPref
 //findRoute(xCo, yCo, xCo1, yCo1, bike) * bikePref
 //and so on
 //put each in a sorted data structure
 //take lowest option
 //multiply by freq
 //add to totalScore
 //repeat for all places
}

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

    async function findBestHome(data) {
      //matrix stuff
      //calculateStrength(place being tested)
    }

    async function findRouteHelper(data) {
      const position5 = new google.maps.LatLng(53.5, 9.8);
      const position4 = new google.maps.LatLng(53, 9);
      const position1 = new google.maps.LatLng(data.coX,data.coY);
      const position2 = new google.maps.LatLng(data.coX1,data.coY1);
      const position3 = new google.maps.LatLng(data.coX2,data.coY2);
      //findRoute(data.add1, data.add1, data.add2, data.add2, 'DRIVING');
      // findRoute(53.5, 9.8, 53,9, 'WALKING');
      //can manipulate a pass on X 
      // findRoute(parseFloat(data.coX), 9.8, 53,9, 'WALKING');
      findRoute(parseFloat(data.coX), parseFloat(data.coY), parseFloat(data.coX1), parseFloat(data.coY1), 'WALKING');
    }

  


  async function findRoute(xCo, yCo, xCo1, yCo1, method) {
    
    setPosition({lat:xCo, lng:yCo}); //this will be moved to the strength calculation function when that is ready, this is just for testing
    
    const {DirectionsService} = await google.maps.importLibrary("routes")
    const dService = new DirectionsService //added() here idk why it worked

    const origin1 = new google.maps.LatLng(xCo, yCo)
    const destination1 = new google.maps.LatLng(xCo1, yCo1)

    const result = await dService.route({
      origin: origin1,
      destination: destination1,
      travelMode: method,
    })

    setDistance(result.routes[0].legs[0].distance.text)
    setTravelTime(result.routes[0].legs[0].duration.text)
    console.log(distance)
    console.log(travelTime) 
    alert(`These two places are ${distance} far apart, and will take ${travelTime} to get there.`);
  }
}


window.App= App;

