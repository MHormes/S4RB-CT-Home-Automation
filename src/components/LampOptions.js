import { useState, useEffect } from "react";
import styles from "./LampOptions.module.css"
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import * as varb from "../Variables";


const LampOptions = (props) => {

    //state for power button pressed
    const [powerButtonState, setPowerButtonState] = useState(0);
    //state for dim button pressed
    const [dimButtonState, setDimButtonState] = useState(0);
    //state for brighten button pressed
    const [brightButtonState, setBrightButtonState] = useState(0);
    //state for white color button pressed
    const [whiteButtonState, setWhiteButtonState] = useState(0);
    //state for choose color button pressed
    const [colorButtonState, setColorButtonState] = useState(0);
    //state for random color button pressed
    const [randomColorButtonState, setRandomColorButtonState] = useState(0);
    //state for back button pressed
    const [backButtonState, setBackButtonState] = useState(0);
    //value to save lamp on or off
    const [currentLampState, setCurrentLampState] = useState();
    //state to save current brightness
    const [currentBrightness, setCurrentBrightness] = useState();
    const selectedLampId = props.selectedLampIdProps;


    // useEffect(() => {
    //     axios.get(varb.bridgeIP + 'api/' + varb.password + '/lights/' + selectedLampId)
    //         .then(res => {
    //             setCurrentLampState(res.data.state.on);
    //             setCurrentBrightness(res.data.state.bri);
    //         })
    //         .catch(err => {
    //             console.log(err)
    //         });
    // }, [])

    //onclick for toggle light button
    const handleLightToggle = () => {
        if (powerButtonState !== 2) {
            setPowerButtonState(powerButtonState + 1);
        }
        else {
            axios.put(varb.bridgeIP + 'api/' + varb.password + '/lights/' + selectedLampId + '/state', { "on": !currentLampState })
                .then(res => {
                    setCurrentLampState(!currentLampState);
                    toast.success("Light " + selectedLampId + " has been toggeled");
                }).catch(err => {
                    console.log(err);
                });
            setPowerButtonState(0);
        }
    }

    //method to switch the classname of button for power
    const handleClassPowerSwitch = () => {
        switch (powerButtonState) {
            case 0: return styles.buttonNone;
            case 1: return styles.buttonFirst;
            case 2: return styles.buttonSecond;
            default: return styles.buttonNone;
        }
    }

    //onclick for dim button
    const handleDimLight = () => {
        if (dimButtonState !== 2) {
            setDimButtonState(dimButtonState + 1);
        }
        else {
            axios.put(varb.bridgeIP + 'api/' + varb.password + '/lights/' + selectedLampId + '/state', { "bri": currentBrightness - 50 })
                .then(res => {
                    setCurrentBrightness(currentBrightness - 50);
                    toast.success("Light " + selectedLampId + " has been dimmed");
                }).catch(err => {
                    console.log(err);
                });
            setDimButtonState(0);
        }
    }

    //method to switch the classname of dim button
    const handleClassDimButton = () => {
        switch (dimButtonState) {
            case 0: return styles.buttonNone;
            case 1: return styles.buttonFirst;
            case 2: return styles.buttonSecond;
            default: return styles.buttonNone;
        }
    }


    //onclick for brighten button
    const handleBrightenLight = () => {
        if (brightButtonState !== 2) {
            setBrightButtonState(brightButtonState + 1);
        }
        else {
            axios.put(varb.bridgeIP + 'api/' + varb.password + '/lights/' + selectedLampId + '/state', { "bri": currentBrightness + 50 })
                .then(res => {
                    console.log(res)
                    setCurrentBrightness(currentBrightness + 50);
                    toast.success("Light " + selectedLampId + " has been brightened");
                }).catch(err => {
                    console.log(err);
                });
            setBrightButtonState(0);
        }
    }
    //method to switch the classname of brighter
    const handleClassBrightButton = () => {
        switch (brightButtonState) {
            case 0: return styles.buttonNone;
            case 1: return styles.buttonFirst;
            case 2: return styles.buttonSecond;
            default: return styles.buttonNone;
        }
    }

    //onclick for white color button
    const handleWhiteColor = () => {
        if (whiteButtonState !== 2) {
            setWhiteButtonState(whiteButtonState + 1);
        }
        else {
            let min = Math.ceil(153);
            let max = Math.floor(500);
            var whiteValue = Math.floor(Math.random() * (max - min + 1) + min);

            axios.put(varb.bridgeIP + 'api/' + varb.password + '/lights/' + selectedLampId + '/state', { "ct": whiteValue })
            .then(res => {
                console.log(res);
                toast.success("Random white tint has been chosen")
            }).catch(err => {
                console.log(err);
            });
            setWhiteButtonState(0);
        }
    }
    //method to switch the classname of white color button
    const handleClassWhiteButton = () => {
        switch (whiteButtonState) {
            case 0: return styles.buttonNone;
            case 1: return styles.buttonFirst;
            case 2: return styles.buttonSecond;
            default: return styles.buttonNone;
        }
    }

    //onclick for color button
    const handleColor = () => {
        if (colorButtonState !== 2) {
            setColorButtonState(colorButtonState + 1);
        }
        else {
            // axios.put(varb.bridgeIP + 'api/' + varb.password + '/lights/' + selectedLampId + '/state', { "ct": whiteValue })
            //     .then(res => {
            //         console.log(res);
            //     }).catch(err => {
            //         console.log(err);
            //     });
            setColorButtonState(0);
        }
    }
    //method to switch the classname color button
    const handleClassColorButton = () => {
        switch (colorButtonState) {
            case 0: return styles.buttonNone;
            case 1: return styles.buttonFirst;
            case 2: return styles.buttonSecond;
            default: return styles.buttonNone;
        }
    }

    //onclick for random color button
    const handleRandomColor = () => {
        if (randomColorButtonState !== 2) {
            setRandomColorButtonState(randomColorButtonState + 1);
        }
        else {
            let min = Math.ceil(0);
            let max = Math.floor(65280);
            var colorValue = Math.floor(Math.random() * (max - min + 1) + min);

            min = Math.ceil(25);
            max = Math.floor(240);
            var satValue = Math.floor(Math.random() * (max - min + 1) + min);

            axios.put(varb.bridgeIP + 'api/' + varb.password + '/lights/' + selectedLampId + '/state', { "hue": colorValue, "sat": satValue })
                .then(res => {
                    console.log(res);
                    toast.success("Random color has been chosen");
                }).catch(err => {
                    console.log(err);
                });
            setRandomColorButtonState(0);
        }
    }
    //method to switch the classname color button
    const handleClassRandomColorButton = () => {
        switch (randomColorButtonState) {
            case 0: return styles.buttonNone;
            case 1: return styles.buttonFirst;
            case 2: return styles.buttonSecond;
            default: return styles.buttonNone;
        }
    }

    const handleBackPress = () => {
        if (backButtonState !== 2) {
            setBackButtonState(backButtonState + 1);
        }
        else {
            setBackButtonState(0);
            window.location.href = varb.mainPage;
        }
    }

    //method to switch the classname color button
    const handleClassBackButton = () => {
        switch (backButtonState) {
            case 0: return styles.buttonNone;
            case 1: return styles.buttonFirst;
            case 2: return styles.buttonSecond;
            default: return styles.buttonNone;
        }
    }


    return (
        <div>
            <p className={styles.p1}>Please select what you want to do with Lamp {selectedLampId}</p>
            <br />
            <p className={styles.p1}>The lamp is currently turned {currentLampState ? "on" : "off"}</p>
            <br />
            <button className={handleClassPowerSwitch()} onClick={() => handleLightToggle()}>Toggle the light</button>
            <button className={handleClassDimButton()} onClick={() => handleDimLight()}>Dim the light</button>
            <button className={handleClassBrightButton()} onClick={() => handleBrightenLight()}>Brighten the light</button>
            <button className={handleClassWhiteButton()} onClick={() => handleWhiteColor()}>Choose a random white tint</button>
            <button className={handleClassColorButton()} onClick={() => handleColor()} disabled={true}>Choose a color for the light</button>
            <button className={handleClassRandomColorButton()} onClick={() => handleRandomColor()}>Surprise me with a color</button>
            <button className={handleClassBackButton()} onClick={() => handleBackPress()}>Go back to lamp selection</button>
            <Toaster />
        </div>
    )
}

export default LampOptions