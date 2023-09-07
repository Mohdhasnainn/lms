import axios from "axios";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";
import { Navigate } from "react-router";

const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(
    Cookies.get("token") && jwt_decode(Cookies.get("token"))?.user
  );

  const [userdata, setUserdata] = useState({});

  useEffect(() => {
    const Fetch = async () => {
      if (user) {
        setLoading(true);
        const { data } = await axios.get(
          import.meta.env.VITE_URL + `/api/auth/user?id=${user?.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              token: Cookies.get("token"),
            },
          }
        );
        setUserdata(data.users);
        setLoading(false);
      }
    };
    Fetch();
  }, [user]);

  if (loading) return "loading";

  return (
    <AuthContext.Provider value={{ user, setUser, userdata, setUserdata }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
