import * as varb from "../Variables";
import * as methods from "../WsMethods"
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

    //This is what i talked about
    webSocket.onmessage = (event) => {
        try {
            let data = JSON.parse(event.data);
            if (typeof data.com != "undefined") {
                if (data.com[0] != "neutral" && data.com[1] >= 0.5 ) {
                    console.log(data.com);
                }
            }

        }
        catch (error) {
            console.log(error);
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
                                        setCortexToken(authResult)
                                        methods.checkCurrentProfile(webSocket, authResult, queryResult).then(profileResult => {
                                            if (profileResult === true) {
                                                methods.createSession(webSocket, authResult, queryResult).then(sessionResult => {
                                                    setSessionId(sessionResult)
                                                    methods.subscribe(webSocket, authResult, sessionResult);
                                                })
                                            } else {
                                                methods.selectProfile(webSocket, authResult, queryResult, profileToLoad).then(result => {
                                                    if (result === true) {
                                                        methods.createSession(webSocket, authResult, queryResult).then(sessionResult => {
                                                            setSessionId(sessionResult)
                                                            methods.subscribe(webSocket, authResult, sessionResult);
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
                        methods.requestAccess();
                    }

                })
            }
        })
    }

    return (
        <>
            <button onClick={() => automatedWSConnect()}>Click this button for the automated process</button>
        </>
    )
}
export default SocketSetup;