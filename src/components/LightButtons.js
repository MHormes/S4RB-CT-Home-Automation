import React, { useState, useEffect } from "react";
import styles from './LightButtons.module.css';
import axios from "axios";
import * as varb from "../Variables"

const LightButtons = (props) => {
    //state for button 1 pressed
    const [button1State, setButton1State] = useState(0);
    //state for button 2 pressed
    const [button2State, setButton2State] = useState(0);

    const [currentLamp1State, setCurrentLamp1State] = useState();
    const [currentLamp2State, setCurrentLamp2State] = useState();

    // useEffect(() => {
    //     axios.get(varb.bridgeIP + 'api/' + varb.password + '/lights/1')
    //         .then(res => {
    //             setCurrentLamp1State(res.data.state.on);
    //         })
    //         .catch(err => {
    //             console.log(err)
    //         });
    //     axios.get(varb.bridgeIP + 'api/' + varb.password + '/lights/2')
    //         .then(res => {
    //             setCurrentLamp2State(res.data.state.on);
    //         })
    //         .catch(err => {
    //             console.log(err)
    //         })

    // })

    //method to switch the className of button 1
    const handleClassNameLight1 = () => {
        switch (button1State) {
            case 0: return styles.buttonNone;
            case 1: return styles.buttonFirst;
            case 2: return styles.buttonSecond;
            default: return styles.buttonNone;
        }
    }

    //Onclick method for button 1
    const handleLight1 = () => {
        if (button1State !== 2) {
            setButton1State(button1State + 1)
        }
        else {
            props.selectLampProps(1);
            setButton1State(0);
        }

    }

    //method to switch the classname of button 2
    const handleClassNameLight2 = () => {
        switch (button2State) {
            case 0: return styles.buttonNone;
            case 1: return styles.buttonFirst;
            case 2: return styles.buttonSecond;
            default: return styles.buttonNone;
        }
    }

    //Onclick method for button 2
    const handleLight2 = () => {
        if (button2State !== 2) {
            setButton2State(button2State + 1)
        }
        else {
            props.selectLampProps(2);
            setButton2State(0);
        }

    }

    return (
        <>
         <div className="button">
            <p className={styles.h1}>Start by selecting the light you want to control</p>
            <button name="light1Button" className={handleClassNameLight1()} onClick={() => handleLight1()}>Light 1 is currently turned {currentLamp1State ? "on" : "off"}</button>
            <button name="light2Button" className={handleClassNameLight2()} onClick={() => handleLight2()}>Light 2 is currently turned {currentLamp2State ? "on" : "off"}</button>
            <button name="light1Button" className={handleClassNameLight1()} onClick={() => handleLight1()}>Light 1 is currently turned {currentLamp1State ? "on" : "off"}</button>
            <button name="light1Button" className={handleClassNameLight1()} onClick={() => handleLight1()}>Light 1 is currently turned {currentLamp1State ? "on" : "off"}</button>
            <button name="light1Button" className={handleClassNameLight1()} onClick={() => handleLight1()}>Light 1 is currently turned {currentLamp1State ? "on" : "off"}</button>
            
            </div>
        </>
    )
}

export default LightButtons