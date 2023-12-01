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

export default function Multiple({childToParent}){
  const [formData, setFormData] = useState({car: "",walk: "",bike: "",coX: "",coY: "",freq: "",coX1: "",coY1: "", freq1: "", coX2: "", coY2: "", freq2: "", coX3: "", coY3: "", freq3: "", coX4: "", coY4: "", freq4: ""});
  //const [formData, setFormData] = useState({car: "",walk: "",transit: "",bike: "",coX: "",coY: "",coX1: "",coY1: "",coX2: "", coY2: ""});
  const [LatLng, setLatLng] = useState();
  const [address, setAddress] = useState();

//   const data = "This is data from Child Component to the Parent Component."

  const [data, setData] = useState(formData);


  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setData(formData);
    childToParent(data);
};

async function findLocation(data) {
  // let response = geocode({ address: "125 NW 10th St, Gainesville, FL 32601" });
  let response = geocode({ address: data.add1 });
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
      //for address lookup
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
    <label htmlFor="add1">Transport Mode Preference</label>
      {/* show hint when hover */}
      <div className="field1">
      <label htmlFor="car">Car:</label>
      <input placeholder = "0-100" type="number" id="car" name="car" value={formData.car} onChange={handleChange}/>

      <label htmlFor="car">Bike:</label>
      <input placeholder = "0-100" type="number" id="bike" name="bike" value={formData.bike} onChange={handleChange}/>

      <label htmlFor="walk">Walk:</label>
      <input placeholder = "0-100" type="number" id="walk" name="walk" value={formData.walk} onChange={handleChange}/>

      <label htmlFor="add1">Address Lookup</label>
      Found Address:  {address}
      <textarea id="add1" placeholder="0"  name="add1" value={formData.add1} onChange={handleChange}/>
      <button className= "button-4" onClick ={() =>findLocation(data)}>Address Lookup</button>
      Use found values for Coordinates! 
 {LatLng}
      <div className = "spacer"></div>
      <label htmlFor="coord1">X-Y-Freq 1</label>
      <textarea id="coX"  placeholder="0"  name="coX" value={formData.coX} onChange={handleChange}/>
      <textarea id="coY"  placeholder="0"  name="coY" value={formData.coY} onChange={handleChange}/>
      <textarea id="freq"  placeholder="0"  name="freq" value={formData.freq} onChange={handleChange}/>

      <label htmlFor="coord2">X-Y-Freq 2</label>
      <textarea id="coX1"  placeholder="0"  name="coX1" value={formData.coX1} onChange={handleChange}/>
      <textarea id="coY1"  placeholder="0"  name="coY1" value={formData.coY1} onChange={handleChange}/>
      <textarea id="freq1"  placeholder="0"  name="freq1" value={formData.freq1} onChange={handleChange}/>

      <label htmlFor="coord3">X-Y-Freq 3</label>
      <textarea id="coX2"  placeholder="0"  name="coX2" value={formData.coX2} onChange={handleChange}/>
      <textarea id="coY2"  placeholder="0"  name="coY2" value={formData.coY2} onChange={handleChange}/>
      <textarea id="freq2"  placeholder="0"  name="freq2" value={formData.freq2} onChange={handleChange}/>

      <label htmlFor="coord3">X-Y-Freq 4</label>
      <textarea id="coX3"  placeholder="0"  name="coX3" value={formData.coX3} onChange={handleChange}/>
      <textarea id="coY3"  placeholder="0"  name="coY3" value={formData.coY3} onChange={handleChange}/>
      <textarea id="freq3"  placeholder="0"  name="freq3" value={formData.freq3} onChange={handleChange}/>

      <label htmlFor="coord4">X-Y-Freq 5</label>
      <div>
      <textarea id="coX4"  placeholder="0"  name="coX4" value={formData.coX4} onChange={handleChange}/>
      <textarea id="coY4"  placeholder="0"  name="coY4" value={formData.coY4} onChange={handleChange}/>
      <textarea id="freq4"  placeholder="0"  name="freq4" value={formData.freq4} onChange={handleChange}/>
      </div>
      
      </div>
      <button className="button-4" type="submit">Go!</button>
      <div className = "spacer"></div>
      {/* <button primary onClick={() => childToParent(data)}>Click Child</button> */}

    </form>
    </div>

  );
}