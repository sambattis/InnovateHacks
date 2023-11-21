"use client";

//import logo from './logo.svg';
//import './App.css';

import {useState} from "react";

import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps"


export default function App() {
  const position = {lat: 53.54, lng: 10};

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

//export default App;

