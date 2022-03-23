import * as varb from "../Variables";
import React, { useEffect, useState } from "react";


const SocketSetup = () => {

    const [webSocket, setWebSocket] = useState();
    const [headsetId, setHeadsetId] = useState();
    const [sessionId, setSessionId] = useState();
    const [cortexToken, setCortexToken] = useState();

    useEffect(() => {
        const ws = new WebSocket(varb.apiUrl);
        setWebSocket(ws);
    }, [])


    //check if user is logged in via the emotiv launcher
    const checkUserLogin = () => {
        const request_access_id = 1;
        let ws = webSocket;

        //check if user is logged in
        let userLoginCall = {
            "id": request_access_id,
            "jsonrpc": "2.0",
            "method": "getUserLogin",
        }

        ws.send(JSON.stringify(userLoginCall))
        ws.onmessage = (event) => {
            try {
                let data = JSON.parse(event.data);
                if (data.id === request_access_id) {
                    if (data.currentOSUId === data.loggedInOSUId) {
                        console.log("user logged in")
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

    ///method to check if there is acces to bci data
    const checkAccessRight = () => {
        const request_access_id = 2;
        let ws = webSocket;

        //check if access has been granted
        let checkAccesCall = {
            "id": request_access_id,
            "jsonrpc": "2.0",
            "method": "hasAccessRight",
            "params": {
                "clientId": varb.clientId,
                "clientSecret": varb.clientSecret
            }
        }

        ws.send(JSON.stringify(checkAccesCall))
        ws.onmessage = (event) => {
            try {
                let data = JSON.parse(event.data);
                if (data.id === request_access_id) {
                    if (data.accessGranted === "true") {
                        console.log("Access granted!")
                    } else {
                        console.log("Access needed")
                    }
                }
            }
            catch (error) {
                console.log(error);
            }
        }
    }

    ///method to request access to the BCI data
    const requestAccess = () => {
        const request_access_id = 3;
        let ws = webSocket;

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

        ws.send(JSON.stringify(accessCall))
        ws.onmessage = (event) => {
            try {
                let data = JSON.parse(event.data);
                if (data.id === request_access_id) {
                    console.log(data);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
    }

    //method to getl ist of connected headsets and set the id
    const queryHeadsets = () => {
        const query_headset_id = 4;
        let ws = webSocket;

        //get list of headsets
        let queryCall = {
            "id": query_headset_id,
            "jsonrpc": "2.0",
            "method": "queryHeadsets"
        }

        ws.send(JSON.stringify(queryCall))
        ws.onmessage = (event) => {
            try {
                let data = JSON.parse(event.data);
                if (data.id === query_headset_id) {
                    if (data.result.length > 0) {
                        setHeadsetId(data.result[0].id)
                        console.log(data.result[0].id)
                    }
                    else {
                        console.log("there are no headsets connected")
                    }
                }
            }
            catch (error) {
                console.log(error);
            }
        }
    }

    //method to make a connection with the headset. Needed to get data stream
    const controlHeadset = () => {
        const control_device_id = 5;
        let ws = webSocket;

        //connect to the headset
        let connectCall = {
            "id": control_device_id,
            "jsonrpc": "2.0",
            "method": "controlDevice",
            "params": {
                "command": "connect",
                "headset": headsetId
            }
        }

        ws.send(JSON.stringify(connectCall))
        ws.onmessage = (event) => {
            try {
                let data = JSON.parse(event.data);
                if (data.id === control_device_id) {
                    console.log(data);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
    }

    //method to get cortex token for later usage
    const authorize = () => {
        const request_token_id = 6;
        let ws = webSocket;

        //get cortex token for later use
        let tokenCall = {
            "id": request_token_id,
            "jsonrpc": "2.0",
            "method": "authorize",
            "params": {
                "clientId": varb.clientId,
                "clientSecret": varb.clientSecret,
                "debit": 100
            }
        }

        ws.send(JSON.stringify(tokenCall))
        ws.onmessage = (event) => {
            try {
                let data = JSON.parse(event.data);
                console.log(data);
                if (data.id === request_token_id) {
                    setCortexToken(data.result.cortexToken)
                }
            }
            catch (error) {
                console.log(error);
            }
        }
    }

    //Start session for data streaming
    const createSession = () => {
        const create_session_id = 7;
        let ws = webSocket;

        //get cortex token for later use
        let createSessionCall = {
            "id": create_session_id,
            "jsonrpc": "2.0",
            "method": "createSession",
            "params": {
                "cortexToken": cortexToken,
                "headset": headsetId,
                "status": "active"
            }
        }

        ws.send(JSON.stringify(createSessionCall))
        ws.onmessage = (event) => {
            try {
                let data = JSON.parse(event.data);
                if (data.id === create_session_id) {
                    setSessionId(data.result.id)
                }
            }
            catch (error) {
                console.log(error);
            }
        }
    }

    //subscribe to channel that will stream mental commands
    const subscribe = () => {
        const subscribe_id = 8;
        let ws = webSocket;

        //start session json
        const subscribeCall = {
            "id": subscribe_id,
            "jsonrpc": "2.0",
            "method": "subscribe",
            "params": {
                "cortexToken": cortexToken,
                "session": sessionId,
                "streams": ["com"]
            }
        }

        ws.send(JSON.stringify(subscribeCall))
        ws.onmessage = (event) => {
            try {
                let data = JSON.parse(event.data);
                if (data.id === subscribe_id) {
                    console.log(data);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <>
            <button onClick={() => checkUserLogin()}>Check for user login</button>
            <button onClick={() => checkAccessRight()}>Check if access has been granted</button>
            <button onClick={() => requestAccess()}>Request access to Emotiv Launcher</button>
            <button onClick={() => queryHeadsets()}>Query the headset</button>
            <button onClick={() => controlHeadset()}>Request headset control</button>
            <button onClick={() => authorize()}>Get auth token</button>
            <button onClick={() => createSession()}>Start session</button>
            <button onClick={() => subscribe()}>subscribe to mental command streaming</button>
        </>
    )
}
export default SocketSetup;