import React, {useState, useContext} from 'react';
import UserContext from '../UserContext'
import axios from 'axios';
import jwtDecode from "jwt-decode";
import { setTokenHeader } from '../utils/apiCall';
import { Link, useNavigate } from "react-router-dom";


const AuthForm = ({loginType}) => {
  const [userFormData, setUserFormData] = useState({
    username: "",
    password: ""
  })

  const {userData, setUserData} = useContext(UserContext);

  const navigate = useNavigate();

  //This function will either sign up/ sign in a user
  //It will set relevant tokens and make a request for the users datpoints
  const handleSubmit = (e) => {
    e.preventDefault();
    axios({
      method: "post",
      url: `/api/auth/${loginType}`,
      data: userFormData
    })
    .then(res =>{
      setTokenHeader(res.data.token);
      localStorage.setItem("jwtToken", res.data.token);
      const userInfo = jwtDecode(res.data.token);
      axios({
        method: "get",
        url: `/api/users/${userInfo.id}/datapoints`,
      }).then(res =>{
        const userDatapoints = res.data
        setUserData({...userInfo, userDatapoints})
      }).then(
        navigate("/")
      ).catch(err => alert(`Something has gone wrong refresh and try again - ${err.response.status}`))
    })
    .catch(err => alert(`Invalid Username or Username Password Combination - ${err.response.status}`))
  }
  

  return (  
    <form onSubmit= {handleSubmit}>
      <label>Username </label>
      <input 
        type="text" 
        name="username" 
        required
        value={userFormData.username}
        onChange={e => setUserFormData({...userFormData, username: e.target.value})}
      />

      <label>Password </label>
         <input 
          type="password" 
          name="password" 
          required 
          value={userFormData.password}
          onChange={e => setUserFormData({...userFormData, password: e.target.value})}
        />
        <button type="submit">
          {loginType == "signup" ? "Sign up" : "Sign In"}
        </button>
      

    </form>
  );
}
 
export default AuthForm;

