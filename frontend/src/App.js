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
    findRouteHelper(data);
    //console.log(data);
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
    let xCo_ = xCo;
    let yCo_ = yCo;
    let freq_ = freq;
    return { xCo_, yCo_, freq_ };
  };

  const [PlaceOne, setPlaceOne] = useState(null)
  const [PlaceTwo, setPlaceTwo] = useState(null)
  const [PlaceThree, setPlaceThree] = useState(null)
  const [PlaceFour, setPlaceFour] = useState(null)
  const [PlaceFive, setPlaceFive] = useState(null)

  const [list, setList] = useState([])

  const [bestX, setBestX] = useState(0)
  const [bestY, setBestY] = useState(0)

  return (
    
    <APIProvider apiKey = {process.env.REACT_APP_API_KEY} >

      <div className="App">
        <header className="App-header">
          <h>NuCasa</h>
        </header>
      </div>
     
      <div className="split left-panel ">
        <Multiple childToParent={childToParent}/>
          <p>{childToParent}</p>
          <button primary onClick={() => childToParent(data)}>Click Child</button> 
      </div>


      <div className="split right-panel " style = {{height: "97vh"} }>
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
//need to hide the childtoparent button



async function calculateStrength(xCo, yCo) {
  let totalScore = 0;
  //console.log(xCo);
  //console.log(yCo);
  for (let i = 0; i < list.length; i++) {
    //console.log((await findRoute(xCo, yCo, list[i].xCo_,list[i].yCo_, 'DRIVING')));
    let dScore = parseFloat(await findRoute(xCo, yCo, list[i].xCo_,list[i].yCo_, 'DRIVING')) * parseFloat(drivingPref);
    let bScore = parseFloat(await findRoute(xCo, yCo, list[i].xCo_,list[i].yCo_, 'BICYCLING')) * parseFloat(bikePref);
    let wScore = parseFloat(await findRoute(xCo, yCo, list[i].xCo_,list[i].yCo_, 'WALKING')) * parseFloat(walkPref);
    //setTScore(findRoute(xCo, yCo, PlaceOne.xCo_,PlaceOne.yCo_, 'TRANSIT') * transitPref);
    
    //console.log(bScore);
    //console.log(wScore);
    let bestScore = 0;
    if (dScore < bScore && dScore < wScore) {
      bestScore = dScore;
    }
    if (bScore < dScore && bScore < wScore) {
      bestScore = bScore;
    }
    if (wScore < bScore && wScore < dScore) {
      bestScore = wScore;
    }
    let placeOneScore = bestScore * parseFloat(list.freq_);
    totalScore += placeOneScore;
  }
  //console.log(totalScore);
 return totalScore;
}
    
    async function findBestHome(minX, maxX, minY, maxY) {
      let bestScore = 0;
      let maxScore = 999999;
      let it = 0;
      while (it < 9) {
        let it1 = 0;
        while (it1 < 9) {
          let testVal = await calculateStrength(parseFloat(minX) + it * (maxY-minY)/9, parseFloat(minY) + it1 * (maxY-minY)/9);
          //console.log(parseFloat((minX)) + it * (maxY-minY)/9);
          //console.log(testVal);
           // console.log(maxScore);
          if (testVal < maxScore) {
            //console.log("improved")
            bestScore = testVal;
            setBestX(parseFloat(minX) + it *(maxX-minX)/9);
            setBestY(parseFloat(minY) + it1 * (maxY-minY)/9);
          }
          it1++;
        }
        it++;
      }
    }

    async function findRouteHelper(data) {
      let minX = 999;
      let maxX = -999;
      let minY = 999;
      let maxY = -999;
      setBikePref(data.bike);
      setWalkPref(data.walk);
      setDrivingPref(data.car);
      setTransitPref(data.transit);
      setPlaceOne(Place(data.coX, data.coY, data.freq));
      setPlaceTwo(Place(data.coX1, data.coY1, data.freq1));
      setPlaceThree(Place(data.coX2, data.coY2, data.freq2));
      setPlaceFour(Place(data.coX3, data.coY3, data.freq3));
      setPlaceFive(Place(data.coX4, data.coY4, data.freq4));
      let newList = [];
      if (PlaceOne.xCo_ != "" && PlaceOne.yCo_ != "" && PlaceOne.freq_ != "") {
        console.log('reached One');
        newList = newList.concat(PlaceOne);
      }

      if (PlaceTwo.xCo_ != "" && PlaceTwo.yCo_ != "" && PlaceOne.freq_ != "") {
        console.log('reached Two');
        newList = newList.concat(PlaceTwo);
      }
      if (PlaceThree.xCo_ != "" && PlaceThree.yCo_ != "" && PlaceThree.freq_ != "") {
        console.log('reached Three');
        newList = newList.concat(PlaceThree);
      }

      if (PlaceFour.xCo_ != "" && PlaceFour.yCo_ != "" && PlaceFour.freq_ != "") {
        console.log('reached Four');
        newList = newList.concat(PlaceFour);
      }

      if (PlaceFive.xCo_ != "" && PlaceFive.yCo_ != "" && PlaceFive.freq_ != "") {
        console.log('reached Five');
        newList = newList.concat(PlaceFive);
      }
      
      const finalNewList = newList;
      setList(finalNewList);

      console.log(list);
      for (let i = 0; i < list.length; i++) {
        if (list[i].xCo_ > maxX) {
          maxX = list[i].xCo_;
        }
        if (list[i].xCo_ < minX) {
          minX = list[i].xCo_;
        }
        if (list[i].yCo_ > maxY) {
          maxY = list[i].yCo_;
        }
        if (list[i].yCo_ < minY) {
           minY = list[i].yCo_;
        }
      }
      console.log(maxX);
      console.log(maxY);
      console.log(minX);
      console.log(minY);

      await findBestHome(minX, maxX, minY, maxY);
      console.log('You should live at');
      console.log(bestX);
      console.log(bestY);
      console.log({lat: bestX, lng:bestY});
      setPosition({lat: bestX, lng:bestY});
    }

  function parseTime(inputString) {
    let regex = /(\d+) hours (\d+) mins/;
    let match = inputString.match(regex);
    let hours = 0;
    let mins = 0;
    //I think I'm still missing some options with days, will have to check later
    if (!match) {
      regex = /(\d+) day (\d+) hours/;
      match = inputString.match(regex);
      if (!match) {
        regex = /(\d+) days (\d+) hours/;
        match = inputString.match(regex);
        if (!match) {
          regex = /(\d+) hour (\d+) mins/;
          match = inputString.match(regex);
          if (!match) {
            regex = /(\d+) hour (\d+) min/;
            match = inputString.match(regex);
            if (!match) {
              regex = /(\d+) hours (\d+) min/;
              match = inputString.match(regex);
              if (!match) {
                regex = /(\d+) mins/;
                match = inputString.match(regex);
                if (!match) {
                  regex = /(\d+) mins/;
                  match = inputString.match(regex);
                  if (!match) {

                  } else {
                    hours = 0;
                    mins = parseInt(match[1], 10);
                  }
                } else {
                  hours = 0;
                  mins = parseInt(match[1], 10);
                }
              } else {
                hours = parseInt(match[1], 10);
                mins = parseInt(match[2], 10);
              }
            } else {
              hours = parseInt(match[1], 10); //error occurs at deepest point every time
              mins = parseInt(match[2], 10); 
            }
          } else {
            hours = parseInt(match[1], 10);
            mins = parseInt(match[2], 10);
          }
        } else {
          hours = parseInt(match[1] * 24, 10) + parseInt(match[2], 10);
          mins = 0;
        }
      } else {
        hours = parseInt(match[1] * 24, 10) + parseInt(match[2], 10);
        mins = 0;
      }
    } else {
      hours = parseInt(match[1], 10);
      mins = parseInt(match[2], 10);
    }
    
    let result = hours + mins / 60;
    return result;
  }

  async function findRoute(xCo, yCo, xCo1, yCo1, method) {
    
    //console.log(xCo)
    //console.log(yCo)
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
    //parse time string and turn into double
    let time = parseTime(result.routes[0].legs[0].duration.text)
    // /console.log(time)
    //console.log(distance)
    //console.log(result.routes[0].legs[0].duration.text) 
    return time
  }
}


window.App= App;



/*  function useDirectionsRenderer({dService}) {
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
  }*/