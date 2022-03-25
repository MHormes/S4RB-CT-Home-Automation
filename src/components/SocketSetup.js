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

    const automatedWSConnect = () => {

        methods.checkUserLogin().then(loginResult => {
            if (loginResult === true) {
                methods.checkAccessRight().then(accessResult => {
                    if (accessResult === true) {
                        methods.queryHeadsets().then(queryResult => {
                            setHeadsetId(queryResult);
                            methods.controlHeadset(queryResult).then(controlResult => {
                                if (controlResult === true) {
                                    methods.authorize().then(authResult => {
                                        setCortexToken(authResult)
                                        methods.checkCurrentProfile(authResult, queryResult).then(profileResult => {
                                            if (profileResult === true) {
                                                methods.createSession(authResult, queryResult).then(sessionResult => {
                                                    setSessionId(sessionResult)
                                                    methods.subscribe(authResult, sessionResult);
                                                })
                                            } else {
                                                methods.selectProfile(authResult, queryResult, profileToLoad).then(result => {
                                                    if (result === true) {
                                                        methods.createSession(authResult, queryResult).then(sessionResult => {
                                                            setSessionId(sessionResult)
                                                            methods.subscribe(authResult, sessionResult);
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