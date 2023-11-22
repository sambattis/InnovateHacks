"use client";

//import logo from './logo.svg';
//import './App.css';

import {useRef, useState} from "react";

import {
  APIProvider,
  useDirectionService,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  AutocompleteProps,
  DirectionsRenderer,
} from "@vis.gl/react-google-maps"


export default function App() {

  const position = {lat: 53.54, lng: 10};

  //feel free to get rid of as much of this implementation as necessary, it wasn't working out because google.map.DirectionService() was not working.
  //"google" was undefined. Not sure if this is because immediately above it, there was no API importing thing, whereas later on when "Map" is used,
  //it is wrapped in <APIProvider></APIProvider

  const [map, setMap] = useState((null))
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [travelTime, setTravelTime] = useState('')
  const [distance, setDistance] = useState('')
  const destinationRef = useRef()
  const originRef = useRef()
  const travelMethodRef = useRef()

  async function findRoute() {
    if (destinationRef.current.value == '' || originRef.current.value == '') {
      return;
    } 

    //const dService = new google.map.DirectionService()
    /*
    const results = await dService.route({
      travelMode: travelMethodRef.current.value,
      destination: destinationRef.current.value,
      origin: originRef.current.value,
    })
    */
  }

  return (
    <APIProvider apiKey = {process.env.GOOGLE_MAPS_API_KEY}>
      <div className="App">
        <header className="App-header">
          <h>NuCasa</h>
        </header>
      </div>
      
      <div style = {{height: "97vh"}}>
        <Map zoom = {9} center = {position}></Map>
      </div>
    </APIProvider>
  );
}

