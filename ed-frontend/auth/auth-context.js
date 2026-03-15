import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext({
  token: null,
  isAuthenticated: false,
  authenticate: (token) => {},
  logout: () => {},
});

function AuthContextProvider({ children }) {
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    async function loadToken() {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        setAuthToken(storedToken);
      }
    }
    loadToken();
  }, []);

  async function authenticate(token) {
    setAuthToken(token);
    await AsyncStorage.setItem("token", token);
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