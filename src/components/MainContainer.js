import styles from './MainContainer.module.css';
import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router';
import { useNavigate } from 'react-router-dom';

import LightButtons from './LightButtons';
import LampOptions from "./LampOptions";
import Stomp from 'stompjs';
import SockJS from "sockjs-client"

const MainContainer = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const ws = new WebSocket("wss://localhost:6868");
        const StompClient = Stomp.over(ws);
        StompClient.connect()

        let requestBody = {
            "id": 1,
            "jsonrpc": "2.0",
            "method": "getCortexInfo",
            "params": {}
        }
        ws.onopen = () => {
            ws.send(JSON.stringify(requestBody))
        }
    })



    const [selectedLampId, setSelectedLampId] = useState();
    const selectLamp = (id) => {
        setSelectedLampId(id);
        console.log(id);
        navigate('/lampOptions')
    }


    return (
        <>
            <h1 className={styles.h1}>Philips hue connection web application</h1>
            <Routes>
                <Route exact path="/" element={<LightButtons
                    selectLampProps={selectLamp} />}>
                </Route>
                <Route exact path="/lampOptions" element={<LampOptions
                    selectedLampIdProps={selectedLampId} />}>
                </Route>
            </Routes>


        </>
    )
}

export default MainContainer