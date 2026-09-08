import { Navigate } from "react-router-dom";

const privateroute = ({children}) => {

    console.log("token:" + token);
    
    const token = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

    return token("token") ? children : <Navigate to={"/"} />
}

export default privateroute;