"use client";
import {createRoot} from 'react-dom/client';
import './App.css';
import { v4 as uuidv4 } from 'uuid';


import React, {useRef, useState, useEffect} from "react";
//import * as React from 'react';
import {
  APIProvider,
  Marker,
  Map,
} from "@vis.gl/react-google-maps"


import Form from "./components/Form.js";

export default function App() {
  const [position, setPosition] = useState({lat: 51, lng: 10});
  const [data, setData] = useState({car: "", walk: "", bus: "", coX: "", coY: "", coX1: "", coY1: "", coX2: "", coY2: ""});

  const [map, setMap] = useState((null))

  const Place = function(xCo, yCo, freq) {
    let xCo_ = xCo;
    let yCo_ = yCo;
    let freq_ = freq;
    return { xCo_, yCo_, freq_ };
  };

  const [bestX, setBestX] = useState(0)
  const [bestY, setBestY] = useState(0)
  const key = process.env.REACT_APP_API_KEY;
  console.log(key);

  const loadGoogleMapsScript = () => {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve();
      } else {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (window.google && window.google.maps) {
            resolve();
          } else {
            reject("Google Maps API failed to load");
          }
        };
        script.onerror = () => {
          reject("Google Maps script failed to load");
        };
        document.head.appendChild(script);
      }
    });
  };

  loadGoogleMapsScript()
    .then(() => {
      console.log("Google Maps script loaded successfully");
      // Now you can safely access google.maps
    })
    .catch((error) => {
      console.error(error);
    });

    const google = window.google

  useEffect (() => {

      console.log('You should live at');
      console.log(bestX);
      console.log(bestY);
      console.log({lat: bestX, lng:bestY});
      setPosition({lat: bestX, lng:bestY});
  
  }, [bestY])

 useEffect (() => {
   //if at least two locations in data
    console.log(data);
    startCalcs(data);
   
 }, [data])

  return (
    <APIProvider apiKey = {key} onLoad={() => console.log('Maps API has loaded.')}>
      <div className="App">
        <header className="App-header">
          <h3> <i class="fas fa-home"></i> NuCasa <i class="fas fa-map-marker-alt"></i></h3>
        <i className="small-text" >The perfect app for quick location triangulation! </i>
        </header>
      </div>
      <div className="split left-panel ">
        <Form data={data} setData={setData}/>
      </div>
      <div className="split right-panel " style = {{height: "95vh"} }>
        <Map zoom = {9} center = {position} onLoad={map => setMap(map)}>
        <Marker position={position} />
        </Map>
      </div>
    </APIProvider>
   
  );


  async function startCalcs(data) {
    let placeOne = (Place(data.coX, data.coY, data.freq));
    let placeTwo = Place(data.coX1, data.coY1, data.freq1);
    let placeThree = Place(data.coX2, data.coY2, data.freq2);
    let placeFour = Place(data.coX3, data.coY3, data.freq3);
    let placeFive = (Place(data.coX4, data.coY4, data.freq4));
    let minX = 90;
    let maxX = -90;
    let minY = 90;
    let maxY = -90;
   
    let newList = [];
    if (placeOne.xCo_ != "" && placeOne.yCo_ != "" && placeOne.freq_ !== "") {
      console.log('reached One');
      newList = newList.concat(placeOne);
    }
    if (placeTwo.xCo_ !== "" && placeTwo.yCo_ !== "" && placeTwo.freq_ !== "") {
      console.log('reached Two');
      newList = newList.concat(placeTwo);
    }
    if (placeThree.xCo_ !== "" && placeThree.yCo_ !== "" && placeThree.freq_ !== "") {
      console.log('reached Three');
      newList = newList.concat(placeThree);
    }
    if (placeFour.xCo_ !== "" && placeFour.yCo_ !== "" && placeFour.freq_ !== "") {
      console.log('reached Four');
      newList = newList.concat(placeFour);
    }
    if (placeFive.xCo_ != "" && placeFive.yCo_ !== "" && placeFive.freq_ !== "") {
      console.log('reached Five');
      newList = newList.concat(placeFive);
    }
   
    const list = newList;
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


    await findBestHome(minX, maxX, minY, maxY, list);
   
  }
   
    async function findBestHome(minX, maxX, minY, maxY, list) {
      console.log('find Best');
      let bestScore = 99999999;
      let it = 0;
      let firstBestX;
      let firstBestY;
      let xDiff = (parseFloat(maxX)-parseFloat(minX))/5;
      let yDiff = (parseFloat(maxY)-parseFloat(minY))/5;
      while (it < 5) {
        let it1 = 0;
        while (it1 < 5) {
          let testVal = await calculateStrength(parseFloat(minX) + it * parseFloat(xDiff), parseFloat(minY) + it1 * parseFloat(yDiff), list);
          if (testVal < bestScore) {
            bestScore = testVal;
            firstBestX = parseFloat(minX) + it *(maxX-minX)/5;
            firstBestY = parseFloat(minY) + it1 * (maxY-minY)/5;
          }
          it1++;
        }
        it++;
      }
      let newMinX = parseFloat(firstBestX) - 0.5 * ((parseFloat(maxX)-parseFloat(minX))/5);
      let newMaxX = parseFloat(firstBestX) + 0.5 * ((parseFloat(maxX)-parseFloat(minX))/5);
      let newMinY = parseFloat(firstBestY) - 0.5 * ((parseFloat(maxY)-parseFloat(minY))/5);
      let newMaxY = parseFloat(firstBestY) + 0.5 * ((parseFloat(maxY)-parseFloat(minY))/5);
      xDiff = (parseFloat(newMaxX)-parseFloat(newMinX))/5;
      yDiff = (parseFloat(newMaxY)-parseFloat(newMinY))/5;
      it = 0;
      while (it < 5) {
        let it1 = 0;
        while (it1 < 5) {
          let testVal = await calculateStrength(parseFloat(newMinX) + it * parseFloat(xDiff), parseFloat(newMinY) + it1 * (parseFloat(yDiff)), list);
          if (parseFloat(testVal) < parseFloat(bestScore)) {
            bestScore = testVal;
            firstBestX = parseFloat(newMinX) + it * parseFloat(xDiff);
            firstBestY = parseFloat(newMinY) + it1 * parseFloat(yDiff);
          }
          it1++;
        }
        it++;
      }
      console.log('set best');
      setBestX(parseFloat(firstBestX));
      setBestY(parseFloat(firstBestY));
    }

    async function calculateStrength(xCo, yCo, list) {
      console.log('calc cstrength');
      let bikePref = data.bike;
      let walkPref = data.walk;
      let drivingPref = data.car;
      let totalScore = 0;
      let dScore = 99999;
      let bScore = 99999;
      let wScore = 99999;
      for (let i = 0; i < list.length; i++) {
        dScore = parseFloat(await findRoute(xCo, yCo, list[i].xCo_,list[i].yCo_, 'DRIVING')) * parseFloat(drivingPref);
        bScore = parseFloat(await findRoute(xCo, yCo, list[i].xCo_,list[i].yCo_, 'BICYCLING')) * parseFloat(bikePref);
        wScore = parseFloat(await findRoute(xCo, yCo, list[i].xCo_,list[i].yCo_, 'WALKING')) * parseFloat(walkPref);
        //setTScore(findRoute(xCo, yCo, placeOne.xCo_,placeOne.yCo_, 'TRANSIT') * transitPref);
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
        let curScore = parseFloat(bestScore) * parseFloat(list[i].freq_);
        totalScore += parseFloat(curScore);
      }
     return totalScore;
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
    const {DirectionsService} = await google.maps.importLibrary("routes")
    const dService = new DirectionsService() //added() here idk why it worked

    const origin1 = new google.maps.LatLng(xCo, yCo)
    const destination1 = new google.maps.LatLng(xCo1, yCo1)

    const result = await dService.route({
      origin: origin1,
      destination: destination1,
      travelMode: method,
    })

    let time = parseTime(result.routes[0].legs[0].duration.text)
    return time
  }
}

window.App= App;






/*  


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
  }*/

