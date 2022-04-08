import { useState, useEffect } from "react";
import styles from "./LampOptions.module.css"
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import * as varb from "../Variables";

const SingleLightToggle = (props) => {

    const selectedLampId = props.selectedLampIdProps;
    const [currentLampState, setCurrentLampState] = useState();

    useEffect(() => {
        // axios.get(varb.bridgeIP + 'api/' + varb.password + '/lights/' + selectedLampId)
        //     .then(res => {
        //         setCurrentLampState(res.data.state.on);
        //     })
        //     .catch(err => {
        //         console.log(err)
        //     });
        if (props.streamEnabledProps === true && typeof props.filteredCommandProps !== "undefined") {
            if (props.filteredCommandProps.action === "left") {
                handleLightOn();
            } else if (props.filteredCommandProps.action === "right") {
                handleLightOff();
            }
        }

    }, [props.filteredCommandProps])

    //onclick for turn on light
    const handleLightOn = () => {
        console.log("turn on");
        // axios.put(varb.bridgeIP + 'api/' + varb.password + '/lights/' + selectedLampId + '/state', { "on": true })
        //     .then(res => {
        //         setCurrentLampState(!currentLampState);
        //         toast.success("Light " + selectedLampId + " has been turned on");
        //     }).catch(err => {
        //         console.log(err);
        //     });
    }

    //onclick for turn off light
    const handleLightOff = () => {
        console.log("turn of");
        // axios.put(varb.bridgeIP + 'api/' + varb.password + '/lights/' + selectedLampId + '/state', { "on": false })
        //     .then(res => {
        //         setCurrentLampState(!currentLampState);
        //         toast.success("Light " + selectedLampId + " has been turned off");
        //     }).catch(err => {
        //         console.log(err);
        //     });
    }
    return (
        <div>
            <p className={styles.p1}>The lamp is currently turned {currentLampState ? "on" : "off"}</p>
            <br />
            <button onClick={() => handleLightOn()}>Turn on the light</button>
            <button onClick={() => handleLightOff()}>Turn off the light</button>
            <Toaster />
        </div>
    )
}

export default SingleLightToggle