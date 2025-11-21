import { createContext, useState } from "react";

const AuthContext = createContext({
  token: "",
  isAuthenticated: false,
  authenticate: (token, username) => {},
  logout: () => {},
});

function AuthContextProvider({ children }) {
  const [authToken, setAuthToken] = useState(null);
  const [username, setUsername] = useState(null);

  function authenticate(token, username) {
    setAuthToken(token);
    setUsername(username);
  }

  function logout() {
    setAuthToken(null);
  }

  const value = {
    token: authToken,
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
export default AuthContextProvider;
