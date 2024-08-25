import { useState } from "react";
import '../App.css';

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

const google = window.google


//Worst case handle api with form and save ideal location locally! & pull it down from local storage 

export default function Form({data, setData}){
  const [formData, setFormData] = useState({car: "",walk: "",bike: "",coX: "",coY: "",freq: "",coX1: "",coY1: "", freq1: "", coX2: "", coY2: "", freq2: "", coX3: "", coY3: "", freq3: "", coX4: "", coY4: "", freq4: ""});
  //const [formData, setFormData] = useState({car: "",walk: "",transit: "",bike: "",coX: "",coY: "",coX1: "",coY1: "",coX2: "", coY2: ""});
  const [LatLng, setLatLng] = useState();
  const [address, setAddress] = useState();

//   const data = "This is data from Child Component to the Parent Component."


  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData.coX1, formData.coY1);
    setData(formData);
};

async function findLocation(data) {
  let response = geocode({ address: data.add1 });
}

        //help alerts
      
        const helpPref = (childdata) => {
          alert("This section is used to input your transport mode preference. Type in your preferences in the format shown below.\n\nExample:\nCar: 15 Bike: 20 Walk: 40\n\nExplanation:\nThis indicates that a car trip duration of 15 minutes is as enjoyable as 20 minutes biking or 40 minutes walking.");
        }
      
        const helpAdd= (childdata) => {
          alert("To look up the longitude and latitude of an address, type in the full address you want the coordinates (longitude and latitude) for. Click \"Find Coordinates\" and use the results in the locations section below.\n\nExample:\nYou want to find the longitude and latitude for Ben Hill Griffin Stadium.\nAction:\n1) Type in the address \"157 Gale Lemerand Dr, Gainesville, FL 32611\".\n2) Click the \"Find Coordinates\" button.\nResult:\nThe coordinates [29.6505, -82.3478] should appear. Use these values as a location coordinate below!");
        }

        const helpCoord = (childdata) => {
          alert("For locations, input the longitude, latitude, and frequency of visits per week.\n\nExample: Ben Hill Griffin Stadium is [29.6505, -82.3478] and you go there twice a week. You should input: [29.6505] [-82.3478] [2] in the boxes.");
        }

        const algorithmExp = (childdata) => {
          alert("The NuCasa app allows a user to input up to five locations, along with the number of times per week they plan to visit each location, and a preference from 0-100 for driving, bicycling, and walking. Upon user submission, the app calculates the location that minimizes total transportation 'cost,' considering frequency of travel to each place and transportation preferences. This is achieved by using the Google Maps Directions service to obtain route durations to each desired destination from a large grid of potential home locations. After finding the best option in the first grid, the search is repeated on a second, smaller grid centered on the initial best location.");
        }
      

function geocode(request) {

  let geocoder = new google.maps.Geocoder();
  let response;
    let responseDiv;


  response = document.createElement("pre");
response.id = "response";
response.innerText = "";
responseDiv = document.createElement("div");
responseDiv.id = "response-container";
responseDiv.appendChild(response);


  // clear();
  geocoder
    .geocode(request)
    .then((result) => {
      const { results } = result;
      //for Coordinate lookup
      console.log("" + results[0].formatted_address);
      setAddress(results[0].formatted_address);
      setLatLng(JSON.stringify(results[0].geometry.location, null, 2));
      responseDiv.style.display = "block";
      console.log("latlng" + LatLng);
      console.log("address" + address);
      return results;
    })
    .catch((e) => {
      alert("Geocode was not successful for the following reason: " + e);
    });


}
return (
    <div className="form-box">
    <form onSubmit={handleSubmit}>
    <div className="field1">
    <label htmlFor="add1"  className = "button-help">Transport Mode Preference  
    <button   onClick ={() =>helpPref(data)} type="button" class="icon-button" aria-label="Help">
      <i class="fas fa-question-circle"></i>
   </button></label>
      {/* show hint when hover */}
      <label htmlFor="car">Car: <i class="fas fa-car"></i> </label>
      <input placeholder = "0-100" type="number" id="car" name="car" value={formData.car} onChange={handleChange}/>

      <label htmlFor="bike">Bike: <i class="fas fa-bicycle"></i> </label>
      <input placeholder = "0-100" type="number" id="bike" name="bike" value={formData.bike} onChange={handleChange}/>

      <label htmlFor="walk">Walk: <i class="fas fa-walking"></i> </label>
      <input placeholder = "0-100" type="number" id="walk" name="walk" value={formData.walk} onChange={handleChange}/>
   </div>

      <div className="field1">

      <label htmlFor="add1" className = "button-help">Coordinate Finder
      <button   onClick ={() =>helpAdd(data)} type="button" class="icon-button" aria-label="Help">
      <i class="fas fa-question-circle"></i>
   </button></label>
      <textarea id="add1" placeholder="Ex: 157 Gale Lemerand Dr, Gainesville, FL 32611"  name="add1" value={formData.add1} onChange={handleChange}/>
     
    {address ?  {'Address Found' : {address}} : '' } 
    {/* Address Found:  {address} */}
    {/* above line only displays an address if it was searched  */}

      <button className= "button-4" onClick ={() =>findLocation(data)}>Find Coordinates</button>

      {LatLng ?  {'Longitude & Latitude Found' : {LatLng}} : '' } 

      {/* Longitude & Latitude Result: {LatLng} */}
 </div>

 <div className="field1">

 
      <div className = "spacer"></div>

      <label className = "button-help" htmlFor="coord1">Locations
      <button    onClick ={() =>helpCoord(data)} type="button" class="icon-button" aria-label="Help">
      <i class="fas fa-question-circle"></i>
   </button>
      </label>

  <label>Location #1</label>
      <textarea id="coX"  placeholder="Longitude"  name="coX" value={formData.coX} onChange={handleChange}/>
      <textarea id="coY"  placeholder="Latitude"  name="coY" value={formData.coY} onChange={handleChange}/>
      <textarea id="freq"  placeholder="Visit(s) per week"  name="freq" value={formData.freq} onChange={handleChange}/>

      <label htmlFor="coord2">Location #2</label>
      <textarea id="coX1"  placeholder="Longitude"  name="coX1" value={formData.coX1} onChange={handleChange}/>
      <textarea id="coY1"  placeholder="Latitude"  name="coY1" value={formData.coY1} onChange={handleChange}/>
      <textarea id="freq1"  placeholder="Visit(s) per week"  name="freq1" value={formData.freq1} onChange={handleChange}/>

      <label htmlFor="coord3">Location #3 </label>
      <textarea id="coX2"  placeholder="Longitude"  name="coX2" value={formData.coX2} onChange={handleChange}/>
      <textarea id="coY2"  placeholder="Latitude"   name="coY2" value={formData.coY2} onChange={handleChange}/>
      <textarea id="freq2"  placeholder="Visit(s) per week" name="freq2" value={formData.freq2} onChange={handleChange}/>

      <label htmlFor="coord3">Location #4</label>
      <textarea id="coX3"  placeholder="Longitude"  name="coX3" value={formData.coX3} onChange={handleChange}/>
      <textarea id="coY3"  placeholder="Latitude"  name="coY3" value={formData.coY3} onChange={handleChange}/>
      <textarea id="freq3"  placeholder="Visit(s) per week"  name="freq3" value={formData.freq3} onChange={handleChange}/>

      <label htmlFor="coord4">Location #5</label>
      <div>
      <textarea id="coX4"  placeholder="Longitude"  name="coX4" value={formData.coX4} onChange={handleChange}/>
      <textarea id="coY4"  placeholder="Latitude"  name="coY4" value={formData.coY4} onChange={handleChange}/>
      <textarea id="freq4"  placeholder="Visit(s) per week"  name="freq4" value={formData.freq4} onChange={handleChange}/>
      </div>
      
      </div>
      <button className="button-4" type="submit">Go!</button>
      <div className = "spacer"></div>

      <button  className="button-4"    onClick ={() =>algorithmExp(data)} type="button" class="icon-button" aria-label="Help">
      How does NuCasa Work? <i class="fas fa-cogs"></i>
   </button>

    </form>
    </div>

  );
}