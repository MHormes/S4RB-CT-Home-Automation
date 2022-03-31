import styles from './MainContainer.module.css';
import React, { useState } from 'react';
import { Route, Routes } from 'react-router';
import { useNavigate } from 'react-router-dom';
import LightButtons from './LightButtons';
import LampOptions from "./LampOptions";
import SocketSetup from './SocketSetup';

const MainContainer = () => {

    const navigate = useNavigate();

    const [selectedLampId, setSelectedLampId] = useState();
    const selectLamp = (id) => {
        setSelectedLampId(id);
        console.log(id);
        navigate('/lampOptions');
    }

    const sendCommand = (command) => {
        command.printCommand();
    }



    return (
        <>
            <h1 className={styles.h1}>Freedom and independence for everyone!</h1>
            <SocketSetup
                sendCommandProps={sendCommand} />
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