import * as varb from "../Variables";
import * as wsMethods from "../WsMethods";
import * as filterMethods from "../WsFilter";
import Command from "./../Models/Command";
import React, { useState } from "react";


const SocketSetup = (props) => {

    //Profile to load from the Emotiv BCI
    const profileToLoad = "Maarten";

    //state for all websocket values
    const [webSocket, setWebSocket] = useState(new WebSocket(varb.apiUrl));
    const [headsetId, setHeadsetId] = useState();
    const [sessionId, setSessionId] = useState();
    const [cortexToken, setCortexToken] = useState();

    //Method to handle incoming bci data
    const dataStreamHandler = () => {
        //On message for data stream of mental commands
        webSocket.onmessage = (event) => {
            try {
                let data = JSON.parse(event.data);
                //check eeg quality and set data stream enables value in maincontainer
                if (typeof data.eq !== "undefined") {
                    if (data.eq[1] >= 90) {
                        props.toggleStreamProps(true);
                    }
                    else{
                        props.toggleStreamProps(false);
                    }
                }

                //mental commands
                if (typeof data.com !== "undefined") {
                    if (data.com[0] !== "neutral" && data.com[1] >= 0.5) {
                        //If command is triggered return the filteredCom and send to main container
                        var filteredCom = filterMethods.filterCommand(new Command("com", data.com[0], data.com[1]));
                        if (typeof filteredCom !== "undefined") {
                            props.sendCommandProps(filteredCom);
                        }
                    }
                }
                //Facial expressions
                if (typeof data.fac !== "undefined") {
                    if (data.fac[0] !== "neutral") {
                        var filteredFacEye = filterMethods.filterCommand(new Command("fac", data.fac[0], null));
                        if (typeof filteredFacEye !== "undefined") {
                            props.sendCommandProps(filteredFacEye);
                        }
                    } if (data.fac[1] !== "neutral" && data.fac[2] >= 0.5) {
                        var filteredFacUp = filterMethods.filterCommand(new Command("fac", data.fac[1], data.fac[2]));
                        if (typeof filteredFacUp !== "undefined") {
                            props.sendCommandProps(filteredFacUp);
                        }
                    } if (data.fac[3] !== "neutral" && data.fac[4] >= 0.5) {
                        var filteredFacDown = filterMethods.filterCommand(new Command("fac", data.fac[3], data.fac[4]));
                        if (typeof filteredFacDown !== "undefined") {
                            props.sendCommandProps(filteredFacDown);
                        }
                    }
                }
            }
            catch (error) {
                console.log(error);
            }
        }
    }

    const automatedWSConnect = () => {
        wsMethods.checkUserLogin(webSocket).then(loginResult => {
            if (loginResult === true) {
                wsMethods.checkAccessRight(webSocket).then(accessResult => {
                    if (accessResult === true) {
                        wsMethods.queryHeadsets(webSocket).then(queryResult => {
                            setHeadsetId(queryResult);
                            wsMethods.controlHeadset(webSocket, queryResult).then(controlResult => {
                                if (controlResult === true) {
                                    wsMethods.authorize(webSocket).then(authResult => {
                                        setCortexToken(authResult)
                                        wsMethods.checkCurrentProfile(webSocket, authResult, queryResult).then(profileResult => {
                                            if (profileResult === true) {
                                                wsMethods.createSession(webSocket, authResult, queryResult).then(sessionResult => {
                                                    setSessionId(sessionResult)
                                                    wsMethods.subscribe("subscribe", webSocket, authResult, sessionResult);
                                                    dataStreamHandler();
                                                })
                                            } else {
                                                wsMethods.selectProfile(webSocket, authResult, queryResult, profileToLoad).then(result => {
                                                    if (result === true) {
                                                        wsMethods.createSession(webSocket, authResult, queryResult).then(sessionResult => {
                                                            setSessionId(sessionResult)
                                                            wsMethods.subscribe("subscribe", webSocket, authResult, sessionResult);
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
                        wsMethods.requestAccess(webSocket);
                    }
                })
            }
        })
    }

    //Method to start subscription again
    const restartSub = () => {
        wsMethods.subscribe("subscribe", webSocket, cortexToken, sessionId);
        dataStreamHandler();
    }

    return (
        <>
            <button onClick={() => automatedWSConnect()}>Click this button for the automated process</button>
            <button onClick={() => wsMethods.subscribe("unsubscribe", webSocket, cortexToken, sessionId)}>Cancel subscription</button>
            <button onClick={() => restartSub()}>Re-do subscription</button>
        </>
    )
}
export default SocketSetup;