"use client";
import {createRoot} from 'react-dom/client';
import './App.css';
import { v4 as uuidv4 } from 'uuid';

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

  // const position = {lat: 51, lng: 9}; 
  const [position, setPosition] = useState({lat: 51, lng: 10});
    // const [data, setData] = useState(10); passes all data from from to map
  const [data, setData] = useState({car: "",walk: "",bus: "",coX: "",coY: "",coX1: "",coY1: "",coX2: "", coY2: ""});

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
  const [transitPref, setTransitPref] = useState('')
  const destinationRef = useRef()
  const originRef = useRef()
  const travelMethodRef = useRef()

  const Place = function(xCo, yCo, freq) {
    const xCo_ = xCo;
    const yCo_ = yCo;
    const freq_ = freq;
    return { xCo_, yCo_, freq_ };
  };

  const [dScore, setDScore] = useState(null)
  const [wScore, setWScore] = useState(null)
  const [bScore, setBScore] = useState(null)
  const [tScore, setTScore] = useState(null)

  const [PlaceOne, setPlaceOne] = useState(null)
  const [PlaceTwo, setPlaceTwo] = useState(null)
  const [PlaceThree, setPlaceThree] = useState(null)
  const [PlaceFour, setPlaceFour] = useState(null)
  const [PlaceFive, setPlaceFive] = useState(null)

  const [list, setList] = useState([])

  const [minX, setMinX] = useState(null) //should this be 0 or something
  const [minY, setMinY] = useState(null)
  const [maxX, setMaxX] = useState(null)
  const [maxY, setMaxY] = useState(null)

  const [bestX, setBestX] = useState(0)
  const [bestY, setBestY] = useState(0)

  return (
    
    <APIProvider apiKey = {process.env.REACT_APP_API_KEY}    >

      <div className="App">
        <header className="App-header">
          <h>NuCasa</h>
          <button className= "button-4" onClick ={() =>findRouteHelper(data)}>testDirections</button>
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
  setDScore(findRoute(xCo, yCo, PlaceOne.xCo,PlaceOne.yCo, PlaceOne.freq) * drivingPref);
  setBScore(findRoute(xCo, yCo, PlaceOne.xCo,PlaceOne.yCo, PlaceOne.freq) * bikePref);
  setWScore(findRoute(xCo, yCo, PlaceOne.xCo,PlaceOne.yCo, PlaceOne.freq) * walkPref);
  setTScore(findRoute(xCo, yCo, PlaceOne.xCo,PlaceOne.yCo, PlaceOne.freq) * transitPref);
 
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
    
    async function findBestHome(minX, maxX, minY, maxY) {
      let maxScore = 0;
      let it = 0;
      let it1 = 0;
      while (it < 9) {
        while (it1 < 9) {
          let testVal = calculateStrength(minX + it *(maxX-minX)/9, minY + it1 * (maxY-minY)/9);
          if (testVal > maxScore) {
            maxScore = testVal;
            setBestX(minX + it *(maxX-minX)/9);
            setBestY(minY + it1 * (maxY-minY)/9);
          }
          it1++;
        }
        it++;
      }
    }

    async function findRouteHelper(data) {
      setBikePref(data.bike);
      setWalkPref(data.walk);
      setDrivingPref(data.car);
      setTransitPref(data.transit);
      setPlaceOne(Place(data.coX, data.coY, data.freq));
      setPlaceTwo(Place(data.coX1, data.coY1, data.freq1));
      setPlaceThree(Place(data.coX2, data.coY2, data.freq2));
      setPlaceFour(Place(data.coX3, data.coY3, data.freq3));
      setPlaceFive(Place(data.coX4, data.coY4, data.freq4));
      console.log(PlaceOne);
      console.log(PlaceOne.xCo_);
      console.log(PlaceFive);
      console.log(PlaceFive.xCo_)            //add each place to list and find min and maxes
      if (PlaceOne.xCo_ != null && PlaceOne.yCo_ != null && PlaceOne.freq_ != null) {
        console.log('reached One');
        if (list != null) {
          const newList = list.concat({PlaceOne});
          setList(newList);
        } else {
          setList({PlaceOne})
        }
      }

      if (PlaceTwo.xCo_ != null && PlaceTwo.yCo_ != null && PlaceOne.freq_ != null) {
        console.log('reached Two');
        if (list != null) {
          const newList = list.concat({PlaceTwo});
          setList(newList);
        } else {
          setList({PlaceTwo})
        }
      }
      if (PlaceThree.xCo_ != null && PlaceThree.yCo_ != null && PlaceThree.freq_ != null) {
        console.log('reached Three');
        if (list != null) {
          const newList = list.concat({PlaceThree});
          setList(newList);
        } else {
          setList({PlaceThree})
        }
      }

      if (PlaceFour.xCo_ != null && PlaceFour.yCo_ != null && PlaceFour.freq_ != null) {
        console.log('reached Four');
        if (list != null) {
          const newList = list.concat({PlaceFour});
          setList(newList);
        } else {
          setList({PlaceFour})
        }
      }

      if (PlaceFive.xCo_ != null && PlaceFive.yCo_ != null && PlaceFive.freq_ != null) {
        console.log('reached Five');
        if (list != null) {
          const newList = list.concat({PlaceFive});
          setList(newList);
        } else {
          setList({PlaceFive})
        }
      }
      
      console.log(list);

      //findRoute(data.add1, data.add1, data.add2, data.add2, 'DRIVING');
      findBestHome();
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
  }
}


window.App= App;

