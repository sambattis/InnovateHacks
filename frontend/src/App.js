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
  const [data, setData] = useState({prefs: {}, places: []});

  const [map, setMap] = useState((null))

  const Place = function(xCo_, yCo_, freq_) {
    let xCo = xCo_;
    let yCo = yCo_;
    let freq = freq_;
    return { xCo, yCo, freq };
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
    if (data.prefs && data.places.length > 1) {
      if (data.prefs.bike && data.prefs.walk && data.prefs.car) {
        console.log('You should live at');
        console.log(bestX);
        console.log(bestY);
        console.log({lat: bestX, lng:bestY});
        setPosition({lat: bestX, lng:bestY});
      }
    }
    }, [bestY])

 useEffect (() => {
   //if at least two locations in data
   console.log(data);
    if (data.prefs && data.places.length > 1) {
      if (data.prefs.bike && data.prefs.walk && data.prefs.car) {
        console.log('start calcs');
        startCalcs(data);
      }
    }
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


  async function startCalcs(data) { //now passes in places only and not prefs 
    let minX = 90;
    let maxX = -90;
    let minY = 90;
    let maxY = -90;
    let places = data.places;
    console.log(places);
   
    let newList = [];
    let i = 0;
    console.log(places.length);
    while (i<places.length){
      console.log(places[i].xCo);
      if (places[i].xCo != "" && places[i].yCo != "" && places[i].freq !== "") {
        let placeOne = (Place(places[i].xCo, places[i].yCo, places[i].freq));
        newList = newList.concat(placeOne);
        console.log('added:'+newList.lastIndex);
      }
      i++;
    }

    const list = newList;
    console.log(list);
    for (let i = 0; i < list.length; i++) {
      if (list[i].xCo > maxX) {
        maxX = list[i].xCo;
      }
      if (list[i].xCo < minX) {
        minX = list[i].xCo;
      }
      if (list[i].yCo > maxY) {
        maxY = list[i].yCo;
      }
      if (list[i].yCo < minY) {
         minY = list[i].yCo;
      }
    }
    console.log(maxX);
    console.log(maxY);
    console.log(minX);
    console.log(minY);
    console.log(list);

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
          //console.log(testVal);
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
      console.log(firstBestX);
    }

    async function calculateStrength(xCo, yCo, list) {
      console.log("calcStrength");
      let bikePref = data.prefs.bike;
      let walkPref = data.prefs.walk;
      let drivingPref = data.prefs.car;
      let totalScore = 0;
      let dScore = 99999;
      let bScore = 99999;
      let wScore = 99999;
      for (let i = 0; i < list.length; i++) {
        dScore = parseFloat(await findRoute(xCo, yCo, list[i].xCo, list[i].yCo, 'DRIVING')) * parseFloat(drivingPref);
        bScore = parseFloat(await findRoute(xCo, yCo, list[i].xCo, list[i].yCo, 'BICYCLING')) * parseFloat(bikePref);
        wScore = parseFloat(await findRoute(xCo, yCo, list[i].xCo, list[i].yCo, 'WALKING')) * parseFloat(walkPref);
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
        let curScore = parseFloat(bestScore) * 1/parseFloat(list[i].freq);
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

    const origin1 = new google.maps.LatLng(xCo, yCo);
    const destination1 = new google.maps.LatLng(xCo1, yCo1);

    const result = await dService.route({
      origin: origin1,
      destination: destination1,
      travelMode: method,
    })

    let time = parseTime(result.routes[0].legs[0].duration.text)
    //console.log(time);
    return time;
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

