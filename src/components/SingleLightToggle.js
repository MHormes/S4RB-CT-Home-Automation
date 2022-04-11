import { useState, useEffect } from "react";
import styles from "./LightButtons.module.css"
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import * as varb from "../Variables";

const SingleLightToggle = (props) => {

    const [button1State, setButton1State] = useState(0);
    const [button2State, setButton2State] = useState(0);
    const selectedLampId = props.selectedLampIdProps;
    const [currentLampState, setCurrentLampState] = useState();

    useEffect(() => {
        axios.get(varb.bridgeIP + 'api/' + varb.password + '/lights/' + selectedLampId)
            .then(res => {
                setCurrentLampState(res.data.state.on);
            })
            .catch(err => {
                console.log(err)
            });
        if (props.streamEnabledProps === true && typeof props.filteredCommandProps !== "undefined") {
            if (props.filteredCommandProps.action === "push") {
                handleLightOn();
            } else if (props.filteredCommandProps.action === "right") {
                handleLightOff();
            }
        }

    }, [props.filteredCommandProps])

    //onclick for turn on light
    const handleLightOn = () => {
        console.log("turn on");
        axios.put(varb.bridgeIP + 'api/' + varb.password + '/lights/' + selectedLampId + '/state', { "on": true })
            .then(res => {
                setCurrentLampState(!currentLampState);
                toast.success("Light " + selectedLampId + " has been turned on");
            }).catch(err => {
                console.log(err);
            });
            const handleClassNameLight1 = () => {
                switch (button1State) {
                    case 0: return styles.buttonNone;
                    case 1: return styles.buttonFirst;
                    case 2: return styles.buttonSecond;
                    default: return styles.buttonNone;
                }
            }


    }

    //onclick for turn off light
    const handleLightOff = () => {
        console.log("turn off");
        axios.put(varb.bridgeIP + 'api/' + varb.password + '/lights/' + selectedLampId + '/state', { "on": false })
            .then(res => {
                setCurrentLampState(!currentLampState);
                toast.success("Light " + selectedLampId + " has been turned off");
            }).catch(err => {
                console.log(err);
            });

            const handleClassNameLight2 = () => {
                switch (button1State) {
                    case 0: return styles.buttonNone;
                    case 1: return styles.buttonFirst;
                    case 2: return styles.buttonSecond;
                    default: return styles.buttonNone;
                }
            }
    }
    return (
        <div>
            <p className={styles.p1}>Lamp is off {currentLampState ? "on" : "off"}</p>
            <br />
            <button className={styles.buttonNone} onClick={() => handleLightOn()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="27.9" height="40.583" viewBox="0 0 27.9 40.583">
  <path id="Icon_awesome-lightbulb" data-name="Icon awesome-lightbulb" d="M7.614,36.013a2.537,2.537,0,0,0,.425,1.4l1.355,2.036A2.536,2.536,0,0,0,11.5,40.583H16.4a2.536,2.536,0,0,0,2.112-1.132l1.355-2.036a2.536,2.536,0,0,0,.425-1.4l0-3.04H7.61l0,3.04ZM0,13.95a13.872,13.872,0,0,0,3.453,9.177,22.778,22.778,0,0,1,4.138,7.249c0,.021.006.041.009.062H20.3c0-.021.006-.04.009-.062a22.778,22.778,0,0,1,4.138-7.249A13.947,13.947,0,1,0,0,13.95ZM13.95,7.609A6.348,6.348,0,0,0,7.609,13.95a1.268,1.268,0,0,1-2.536,0A8.887,8.887,0,0,1,13.95,5.073a1.268,1.268,0,0,1,0,2.536Z" transform="translate(0 0)" fill="#000000"/>
</svg>Turn on the light</button>
            <button className={styles.buttonNone} onClick={() => handleLightOff()}><svg xmlns="http://www.w3.org/2000/svg" width="27.9" height="40.583" viewBox="0 0 27.9 40.583">
  <path id="Icon_awesome-lightbulb" data-name="Icon awesome-lightbulb" d="M7.614,36.013a2.537,2.537,0,0,0,.425,1.4l1.355,2.036A2.536,2.536,0,0,0,11.5,40.583H16.4a2.536,2.536,0,0,0,2.112-1.132l1.355-2.036a2.536,2.536,0,0,0,.425-1.4l0-3.04H7.61l0,3.04ZM0,13.95a13.872,13.872,0,0,0,3.453,9.177,22.778,22.778,0,0,1,4.138,7.249c0,.021.006.041.009.062H20.3c0-.021.006-.04.009-.062a22.778,22.778,0,0,1,4.138-7.249A13.947,13.947,0,1,0,0,13.95ZM13.95,7.609A6.348,6.348,0,0,0,7.609,13.95a1.268,1.268,0,0,1-2.536,0A8.887,8.887,0,0,1,13.95,5.073a1.268,1.268,0,0,1,0,2.536Z" transform="translate(0 0)" fill="#000000"/>
</svg>Turn off the light</button>
            <Toaster />
        </div>
    )
}

export default SingleLightToggle