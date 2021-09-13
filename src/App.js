import Cookies from "js-cookie"
import React, { useState } from "react"
import { Redirect } from "react-router-dom";
import './Assets/CSS/All.css'

export default function App(){
    const [token, setToken] = useState(Cookies.get("ud"));
    if(token){

    }else{
        // setToken(false)
        return <Redirect to="/auth" />
    }
    return(
        <></>
    )
}
