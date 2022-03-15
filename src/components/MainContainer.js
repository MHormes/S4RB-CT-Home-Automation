import styles from './MainContainer.module.css';
import React, { useState } from 'react';
import { Route, Routes } from 'react-router';
import { useNavigate } from 'react-router-dom';

import LightButtons from './LightButtons';
import LampOptions from "./LampOptions";

const MainContainer = () => {

    const navigate = useNavigate();



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
                selectLampProps={selectLamp}/>}>
                </Route>
                <Route exact path="/lampOptions" element={<LampOptions
                selectedLampIdProps={selectedLampId}/>}>
                </Route>
            </Routes>


        </>
    )
}

export default MainContainer