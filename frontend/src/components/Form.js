import { useState } from "react";
import '../App.css';

//Worst case handle api with form and save ideal location locally! & pull it down from local storage 

export default function Multiple({childToParent}){
  const [formData, setFormData] = useState({car: "",walk: "",bus: "",add1: 10,add2: 40,add3: "",add4: "",add5: ""});

//   const data = "This is data from Child Component to the Parent Component."

  const [data, setData] = useState(formData);


  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setData(formData);
    alert(`Car: ${formData.car}, Walk: ${formData.walk}, bus: ${formData.bus},add1: ${formData.add1}, add2: ${formData.add2}, add3: ${formData.add3}`
    );
};
return (
    <div className="form-box">
    {/* <h5 className="form-step">Where should I live?</h5> */}
    <form onSubmit={handleSubmit}>
      Preference
      {/* show hint when hover */}

      <div className="field1">
      <label htmlFor="car"></label>
      <input placeholder = "Car: 0.7" type="number" id="car" name="car" value={formData.car} onChange={handleChange}/>

      <label htmlFor="walk">walk:</label>
      <input type="number" id="walk" name="walk" value={formData.walk} onChange={handleChange}/>

      <label htmlFor="bus">bus:</label>
      <input id="bus" type="number" name="bus" value={formData.bus} onChange={handleChange}/>

      <label htmlFor="address1">Address:</label>
      <textarea id="add1"  placeholder="123 Main Street.."  name="add1" value={formData.add1} onChange={handleChange}/>

      <label htmlFor="address2">Address:</label>
      <textarea id="add2"  placeholder="123 Main Street.."  name="add2" value={formData.add2} onChange={handleChange}/>
      </div>

      <button className="goBtn" type="submit">Go!</button>
      <button primary onClick={() => childToParent(data)}>Click Child</button>

    </form>
    </div>
  );
}
