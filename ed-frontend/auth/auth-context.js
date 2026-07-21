import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext({
  token: null,
  username: null,
  email: null,
  isAuthenticated: false,
  authenticate: (token, userInfo) => {},
  logout: () => {},
});

function AuthContextProvider({ children }) {
  const [authToken, setAuthToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    async function loadAuthData() {
      const storedToken = await AsyncStorage.getItem("token");
      const storedUsername = await AsyncStorage.getItem("username");
      const storedEmail = await AsyncStorage.getItem("email");

      if (storedToken) {
        setAuthToken(storedToken);
      }
      if (storedUsername) {
        setUsername(storedUsername);
      }
      if (storedEmail) {
        setEmail(storedEmail);
      }
    }
    loadAuthData();
  }, []);

  async function authenticate(token, userInfo = {}) {
    setAuthToken(token);
    setUsername(userInfo.username || null);
    setEmail(userInfo.email || null);

    await AsyncStorage.setItem("token", token);
    if (userInfo.username) {
      await AsyncStorage.setItem("username", userInfo.username);
    }
    if (userInfo.email) {
      await AsyncStorage.setItem("email", userInfo.email);
    }
  }

  async function logout() {
    setAuthToken(null);
    await AsyncStorage.removeItem("token");
  }

  return (
    <AuthContext.Provider
      value={{
        token: authToken,
        isAuthenticated: !!authToken,
        authenticate,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
export default AuthContextProvider;