import axios from "axios";

//const API_KEY = "AIzaSyAjRvladlwU8sJiZEtrtxj23uN9XDIxVqM";
//const BASE_URL = "http://192.168.0.125"

export async function createUser(email, password) {
  const response = await axios.post(
    `${BASE_URL}/api/auth/login/`,
    {
      email: email,
      password: password,
      //returnSecureToken: true,
    }
  );

  //const token = response.data.idToken;
  //return token;
  return response.data;
}

export async function loginUser(email, password) {
  const response = await axios.post(
    `${BASE_URL}/api/auth/login/`,
    {
      email: email,
      password: password,
      //returnSecureToken: true,
    }
  );
  
  //const token = response.data.idToken;
  //return token;
  return response.data;
}
