import * as varb from "../Variables";
import React, { useEffect, useState } from "react";


const SocketSetup = () => {

    const profileToLoad = "Maarten";

    const [webSocket, setWebSocket] = useState();
    const [headsetId, setHeadsetId] = useState();
    const [sessionId, setSessionId] = useState();
    const [cortexToken, setCortexToken] = useState();

    //setup websocket on page load
    useEffect(() => {
        const ws = new WebSocket(varb.apiUrl);
        setWebSocket(ws);
    }, [])

    //Method that does a setup for command streaming
    const automatedWSConnect = () => {
        let ws = webSocket;

        const check_login_id = 1;
        //check if user is logged in
        let userLoginCall = {
            "id": check_login_id,
            "jsonrpc": "2.0",
            "method": "getUserLogin",
        }
        //Send check for user login
        ws.send(JSON.stringify(userLoginCall))
        ws.onmessage = (event) => {
            try {
                let data = JSON.parse(event.data);
                if (data.id === check_login_id) {
                    if (data.currentOSUId === data.loggedInOSUId) {
                        console.log("user logged in")

                        //Check if access has been granted
                        const check_access_id = 2;
                        let checkAccesCall = {
                            "id": check_access_id,
                            "jsonrpc": "2.0",
                            "method": "hasAccessRight",
                            "params": {
                                "clientId": varb.clientId,
                                "clientSecret": varb.clientSecret
                            }
                        }
                        //send check for access granted
                        ws.send(JSON.stringify(checkAccesCall))
                        ws.onmessage = (event) => {
                            try {
                                let data = JSON.parse(event.data);
                                if (data.id === check_access_id) {
                                    if (data.result.accessGranted === true) {
                                        console.log("Access granted!")

                                        //query headset
                                        const query_headset_id = 4;
                                        //get list of headsets
                                        let queryCall = {
                                            "id": query_headset_id,
                                            "jsonrpc": "2.0",
                                            "method": "queryHeadsets"
                                        }
                                        //send headset query
                                        ws.send(JSON.stringify(queryCall))
                                        ws.onmessage = (event) => {
                                            try {
                                                let data = JSON.parse(event.data);
                                                if (data.id === query_headset_id) {
                                                    if (data.result.length > 0) {
                                                        setHeadsetId(data.result[0].id)
                                                        console.log("Headset found: " + data.result[0].id)

                                                        //need var for later use since state wont be set?
                                                        var headsetIdTemp = data.result[0].id;

                                                        //connect to headset
                                                        const control_device_id = 5;
                                                        let connectCall = {
                                                            "id": control_device_id,
                                                            "jsonrpc": "2.0",
                                                            "method": "controlDevice",
                                                            "params": {
                                                                "command": "connect",
                                                                "headset": headsetId
                                                            }
                                                        }
                                                        //send controll request
                                                        ws.send(JSON.stringify(connectCall))
                                                        ws.onmessage = (event) => {
                                                            try {
                                                                let data = JSON.parse(event.data);
                                                                if (data.id === control_device_id) {
                                                                    console.log("Headset has been connected");

                                                                    //get cortexToken
                                                                    const request_token_id = 6;
                                                                    let tokenCall = {
                                                                        "id": request_token_id,
                                                                        "jsonrpc": "2.0",
                                                                        "method": "authorize",
                                                                        "params": {
                                                                            "clientId": varb.clientId,
                                                                            "clientSecret": varb.clientSecret
                                                                        }
                                                                    }
                                                                    //send authorize request
                                                                    ws.send(JSON.stringify(tokenCall))
                                                                    ws.onmessage = (event) => {
                                                                        try {
                                                                            let data = JSON.parse(event.data);
                                                                            if (data.id === request_token_id) {
                                                                                setCortexToken(data.result.cortexToken)
                                                                                console.log("cortexToken has been received")

                                                                                //state not set? need temp variable
                                                                                var cortexTokenTemp = data.result.cortexToken;

                                                                                //check if profile has been selected
                                                                                const check_profile_id = 7;
                                                                                //get the currently used training profile
                                                                                let checkProfileCall = {
                                                                                    "id": check_profile_id,
                                                                                    "jsonrpc": "2.0",
                                                                                    "method": "getCurrentProfile",
                                                                                    "params": {
                                                                                        "cortexToken": cortexTokenTemp,
                                                                                        "headset": headsetIdTemp
                                                                                    }
                                                                                }
                                                                                //send request to see current prfile
                                                                                ws.send(JSON.stringify(checkProfileCall))
                                                                                ws.onmessage = (event) => {
                                                                                    try {
                                                                                        let data = JSON.parse(event.data);
                                                                                        if (data.id === check_profile_id) {
                                                                                            if (data.result.name != null) {
                                                                                                console.log("profile selected: " + data.result.name)
                                                                                            } else {
                                                                                                console.log("no profile selected yet")

                                                                                                //select profile. (name is hardcoded on top)
                                                                                                const select_profile_id = 8;
                                                                                                //set the used training profile
                                                                                                let selectProfileCall = {
                                                                                                    "id": select_profile_id,
                                                                                                    "jsonrpc": "2.0",
                                                                                                    "method": "setupProfile",
                                                                                                    "params": {
                                                                                                        "cortexToken": cortexTokenTemp,
                                                                                                        "headset": headsetIdTemp,
                                                                                                        "profile": profileToLoad,
                                                                                                        "status": "load"
                                                                                                    }
                                                                                                }
                                                                                                //send select profile 
                                                                                                ws.send(JSON.stringify(selectProfileCall))
                                                                                                ws.onmessage = (event) => {
                                                                                                    try {
                                                                                                        let data = JSON.parse(event.data);
                                                                                                        if (data.id === select_profile_id) {
                                                                                                            if (data.result.action === "load") {
                                                                                                                console.log("profile selected successfully: " + data.result.name)

                                                                                                                //temp
                                                                                                                const create_session_id = 9;
                                                                                                                //start session with cortex token for data stream
                                                                                                                let createSessionCall = {
                                                                                                                    "id": create_session_id,
                                                                                                                    "jsonrpc": "2.0",
                                                                                                                    "method": "createSession",
                                                                                                                    "params": {
                                                                                                                        "cortexToken": cortexTokenTemp,
                                                                                                                        "headset": headsetIdTemp,
                                                                                                                        "status": "active"
                                                                                                                    }
                                                                                                                }
                                                                                                                //send request to start session
                                                                                                                ws.send(JSON.stringify(createSessionCall))
                                                                                                                ws.onmessage = (event) => {
                                                                                                                    try {
                                                                                                                        let data = JSON.parse(event.data);
                                                                                                                        if (data.id === create_session_id) {
                                                                                                                            setSessionId(data.result.id)
                                                                                                                            console.log("session successfully started")

                                                                                                                            //need var to subscribe. state not loaded yet?
                                                                                                                            var sessionIdTemp = data.result.id;

                                                                                                                            //start subscription
                                                                                                                            const subscribe_id = 10;
                                                                                                                            const subscribeCall = {
                                                                                                                                "id": subscribe_id,
                                                                                                                                "jsonrpc": "2.0",
                                                                                                                                "method": "subscribe",
                                                                                                                                "params": {
                                                                                                                                    "cortexToken": cortexTokenTemp,
                                                                                                                                    "session": sessionIdTemp,
                                                                                                                                    "streams": ["com", "fac"]
                                                                                                                                }
                                                                                                                            }
                                                                                                                            //send subscribe request
                                                                                                                            ws.send(JSON.stringify(subscribeCall))
                                                                                                                            ws.onmessage = (event) => {
                                                                                                                                try {
                                                                                                                                    let data = JSON.parse(event.data);
                                                                                                                                    if (data.id === subscribe_id) {
                                                                                                                                        //DO SOMETHING
                                                                                                                                        console.log(data);
                                                                                                                                    }
                                                                                                                                }
                                                                                                                                catch (error) {
                                                                                                                                    console.log(error);
                                                                                                                                }
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }
                                                                                                                    catch (error) {
                                                                                                                        console.log(error);
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                    catch (error) {
                                                                                                        console.log(error);
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                    catch (error) {
                                                                                        console.log(error);
                                                                                    }
                                                                                }

                                                                                //start session


                                                                            }
                                                                        }
                                                                        catch (error) {
                                                                            console.log(error);
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                            catch (error) {
                                                                console.log(error);
                                                            }
                                                        }
                                                    }
                                                    else {
                                                        console.log("there are no headsets connected. Turn on your headset and try again")
                                                    }
                                                }
                                            }
                                            catch (error) {
                                                console.log(error);
                                            }
                                        }

                                    } else {
                                        //request access
                                        const request_access_id = 3;
                                        //request access only called once ever
                                        let accessCall = {
                                            "id": request_access_id,
                                            "jsonrpc": "2.0",
                                            "method": "requestAccess",
                                            "params": {
                                                "clientId": varb.clientId,
                                                "clientSecret": varb.clientSecret
                                            }
                                        }
                                        //send request access
                                        ws.send(JSON.stringify(accessCall))
                                        ws.onmessage = (event) => {
                                            try {
                                                let data = JSON.parse(event.data);
                                                if (data.id === request_access_id) {
                                                    console.log("Access request send");
                                                }
                                            }
                                            catch (error) {
                                                console.log(error);
                                            }
                                        }
                                        console.log("Access needed. Please check the emotiv launcher. Press button again after giving access")
                                    }
                                }
                            }
                            catch (error) {
                                console.log(error);
                            }
                        }

                    } else {
                        console.log("Please login via the emotiv launcher")
                    }
                }
            }
            catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <>
            <button onClick={() => automatedWSConnect()}>Click this button for the automated process</button>
        </>
    )
}
export default SocketSetup;