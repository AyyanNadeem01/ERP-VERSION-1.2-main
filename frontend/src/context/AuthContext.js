import React, { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
const [token, setToken] = useState(localStorage.getItem("token") || null);
const [user, setUser] = useState(null);


const login = (jwt) => {
localStorage.setItem("token", jwt);
setToken(jwt);
toast.success("Login successful");
};


const logout = () => {
localStorage.removeItem("token");
setToken(null);
toast("Logged out");
};


return (
<AuthContext.Provider value={{ token, login, logout, user, setUser }}>
{children}
</AuthContext.Provider>
);
};


export const useAuth = () => useContext(AuthContext);