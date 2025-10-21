import { useState } from "react";
import { AuthContext } from "./auth-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

function ContextProvider({ children }) {
  const [userToken, setUserToken] = useState(null);
}

export default ContextProvider;
