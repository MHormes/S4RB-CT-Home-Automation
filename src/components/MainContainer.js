import styles from './MainContainer.module.css';
import React, { useState } from 'react';
import { Route, Routes } from 'react-router';
import { useNavigate } from 'react-router-dom';
import LightButtons from './LightButtons';
import LampOptions from "./LampOptions";
import SocketSetup from './SocketSetup';
import SingleLightToggle from "./SingleLightToggle"

const MainContainer = () => {

    const navigate = useNavigate();

    //Method to select a lamp and get its id value
    const [selectedLampId, setSelectedLampId] = useState("2"); //hardcoded lamp ID for POC
    const selectLamp = (id) => {
        setSelectedLampId(id);
        console.log(id);
        navigate('/lampOptions');
    }

    //Enable or disable stream based on eeg quality
    const [streamEnabled, setStreamEnabled] = useState(false);
    const toggleStream = (value) => {
        setStreamEnabled(value);
    }

    //called when filtered command is send
    const [filteredCommand, setFilterdCommand] = useState();
    const sendCommand = (command) => {
        setFilterdCommand(command);
    }

    return (
        <>
            <h1 className={styles.h1}>Freedom and independence for everyone!</h1>
            <SocketSetup
                sendCommandProps={sendCommand}
                toggleStreamProps={toggleStream} />
            <Routes>
                {/* <Route exact path="/" element={<LightButtons
                    selectLampProps={selectLamp} />}>
                </Route> */}
                {/* <Route exact path="/lampOptions" element={<LampOptions
                    selectedLampIdProps={selectedLampId} />}>
                </Route> */}
                <Route exact path="/" element={<SingleLightToggle
                    selectedLampIdProps={selectedLampId}
                    filteredCommandProps={filteredCommand}
                    streamEnabledProps={streamEnabled} />}>
                </Route>
            </Routes>
        </>
    )
}

export default MainContainer