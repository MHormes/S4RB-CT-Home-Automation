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
                console.log("turn on");
            } else if (props.filteredCommandProps.action === "right") {
                console.log("turn off")
            }
        }

    }, [props.filteredCommandProps])

    //onclick for toggle light button
    const handleLightToggle = () => {
        axios.put(varb.bridgeIP + 'api/' + varb.password + '/lights/' + selectedLampId + '/state', { "on": !currentLampState })
            .then(res => {
                setCurrentLampState(!currentLampState);
                toast.success("Light " + selectedLampId + " has been toggeled");
            }).catch(err => {
                console.log(err);
            });
    }

    return (
        <div>
            <p className={styles.p1}>The lamp is currently turned {currentLampState ? "on" : "off"}</p>
            <br />
            <button onClick={() => handleLightToggle()}>Toggle the light</button>
            <Toaster />
        </div>
    )
}

export default SingleLightToggle