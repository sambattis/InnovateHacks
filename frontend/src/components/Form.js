import { useState } from "react";
import '../App.css';

//Worst case handle api with form and save ideal location locally! & pull it down from local storage 

export default function Multiple({childToParent}){
  const [formData, setFormData] = useState({car: "",walk: "",bus: "",bike: "",coX: "",coY: "",coX1: "",coY1: "",coX2: "", coY2: ""});

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
    // alert(`Car: ${formData.car}, Walk: ${formData.walk}, bus: ${formData.bus},add1: ${formData.add1}, add2: ${formData.add2}, add3: ${formData.add3}`
    // );
};
return (
    <div className="form-box">
    {/* <h5 className="form-step">Where should I live?</h5> */}
    <form onSubmit={handleSubmit}>
      PREFERENCE
      {/* show hint when hover */}

      <div className="field1">
      <label htmlFor="car">Car:</label>
      <input placeholder = "0-100" type="number" id="car" name="car" value={formData.car} onChange={handleChange}/>

      <label htmlFor="car">Bike:</label>
      <input placeholder = "0-100" type="number" id="bike" name="bike" value={formData.bike} onChange={handleChange}/>

      <label htmlFor="walk">Walk:</label>
      <input placeholder = "0-100" type="number" id="walk" name="walk" value={formData.walk} onChange={handleChange}/>

      <label htmlFor="bus">Bus:</label>
      <input placeholder = "0-100" id="bus" type="number" name="bus" value={formData.bus} onChange={handleChange}/>

      <label htmlFor="coord1">Coords. 1</label>
      <textarea id="coX"  placeholder="0"  name="coX" value={formData.coX} onChange={handleChange}/>
      <textarea id="coY"  placeholder="0"  name="coY" value={formData.coY} onChange={handleChange}/>

      <label htmlFor="coord2">Coords. 2</label>
      <textarea id="coX1"  placeholder="0"  name="coX1" value={formData.coX1} onChange={handleChange}/>
      <textarea id="coY1"  placeholder="0"  name="coY1" value={formData.coY1} onChange={handleChange}/>

      <label htmlFor="coord3">Coords. 3</label>
      <textarea id="coX2"  placeholder="0"  name="coX2" value={formData.coX2} onChange={handleChange}/>
      <textarea id="coY2"  placeholder="0"  name="coY2" value={formData.coY2} onChange={handleChange}/>
      </div>
      <button className="button-4" type="submit">Go!</button>
      {/* <button primary onClick={() => childToParent(data)}>Click Child</button> */}

    </form>
    </div>

  );
}
