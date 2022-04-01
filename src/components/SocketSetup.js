import * as varb from "../Variables";
import * as methods from "../WsMethods";
import Command from "./../Models/Command";
import React, { useState } from "react";


const SocketSetup = (props) => {

    //Profile to load from the Emotiv BCI
    const profileToLoad = "Zonar";

    //state for all websocket values
    const [webSocket, setWebSocket] = useState(new WebSocket(varb.apiUrl));
    const [headsetId, setHeadsetId] = useState();
    const [sessionId, setSessionId] = useState();
    const [cortexToken, setCortexToken] = useState();

    //Variables for counting incoming data -> only display a part (data stream is way to fast)
    var comCounter = 0;
    var facCounter = 0;
    //Method to handle incoming bci data
    const dataStreamHandler = () => {
        //On message for data stream of mental commands
        webSocket.onmessage = (event) => {
            try {
                let data = JSON.parse(event.data);
                //mental commands
                if (typeof data.com !== "undefined") {
                    comCounter++;
                    if (data.com[0] !== "neutral" && data.com[1] >= 0.5 && comCounter === 8) {
                        props.sendCommandProps(new Command("mental", data.com[0], data.com[1]));
                        comCounter = 0;
                    }
                }
                //Facial expressions
                if (typeof data.fac !== "undefined") {
                    facCounter++;
                    if (data.fac[0] !== "neutral" && facCounter === 25) {
                        props.sendCommandProps(new Command("eyes", data.fac[0], null));
                        facCounter = 0;
                    } else if (data.fac[1] !== "neutral" && facCounter === 25) {
                        props.sendCommandProps(new Command("upper", data.fac[1], data.fac[2]));
                        facCounter = 0;
                    } else if (data.fac[3] !== "neutral" && facCounter === 25) {
                        props.sendCommandProps(new Command("upper", data.fac[3], data.fac[4]));
                        facCounter = 0;
                    }
                }
            }
            catch (error) {
                console.log(error);
            }
        }
    }

    const automatedWSConnect = () => {
        methods.checkUserLogin(webSocket).then(loginResult => {
            if (loginResult === true) {
                methods.checkAccessRight(webSocket).then(accessResult => {
                    if (accessResult === true) {
                        methods.queryHeadsets(webSocket).then(queryResult => {
                            setHeadsetId(queryResult);
                            methods.controlHeadset(webSocket, queryResult).then(controlResult => {
                                if (controlResult === true) {
                                    methods.authorize(webSocket).then(authResult => {
                                        console.log(authResult);
                                        setCortexToken(authResult)
                                        methods.checkCurrentProfile(webSocket, authResult, queryResult).then(profileResult => {
                                            if (profileResult === true) {
                                                methods.createSession(webSocket, authResult, queryResult).then(sessionResult => {
                                                    setSessionId(sessionResult)
                                                    methods.subscribe("subscribe", webSocket, authResult, sessionResult);
                                                    dataStreamHandler();
                                                })
                                            } else {
                                                methods.selectProfile(webSocket, authResult, queryResult, profileToLoad).then(result => {
                                                    if (result === true) {
                                                        methods.createSession(webSocket, authResult, queryResult).then(sessionResult => {
                                                            setSessionId(sessionResult)
                                                            methods.subscribe("subscribe", webSocket, authResult, sessionResult);
                                                            dataStreamHandler();
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    })
                                }
                            })
                        })

                    } else {
                        methods.requestAccess(webSocket);
                    }
                })
            }
        })
    }

    //Method to start subscription again
    const restartSub = () => {
        methods.subscribe("subscribe", webSocket, cortexToken, sessionId);
        dataStreamHandler();
    }

    return (
        <>
            <button onClick={() => automatedWSConnect()}>Click this button for the automated process</button>
            <button onClick={() => methods.subscribe("unsubscribe", webSocket, cortexToken, sessionId)}>Cancel subscription</button>
            <button onClick={() => restartSub()}>Re-do subscription</button>
        </>
    )
}
export default SocketSetup;