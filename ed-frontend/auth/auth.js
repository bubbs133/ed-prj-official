import axios from "axios";

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
