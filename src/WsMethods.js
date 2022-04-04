//Methods used for ws connection. Used in the automated process.
import * as varb from "./Variables";

//check if user is logged in via the emotiv launcher
export const checkUserLogin = async (webSocket) => {
    return new Promise(function (resolve, reject) {
        const check_login_id = 1;
        let ws = webSocket;

        //check if user is logged in
        let userLoginCall = {
            "id": check_login_id,
            "jsonrpc": "2.0",
            "method": "getUserLogin",
        }

        ws.send(JSON.stringify(userLoginCall))
        ws.onmessage = (event) => {
            try {
                let data = JSON.parse(event.data);
                if (data.id === check_login_id) {
                    if (data.currentOSUId === data.loggedInOSUId) {
                        console.log("user logged in")
                        resolve(true)
                    } else {
                        console.log("Please login via the emotiv launcher")
                        resolve(false);
                    }
                }
            }
            catch (error) {
                console.log(error);
                reject(error);
            }
        }
    })

}

///method to check if there is acces to bci data
export const checkAccessRight = (webSocket) => {
    return new Promise(function (resolve, reject) {
        const check_access_id = 2;
        let ws = webSocket;

        //check if access has been granted
        let checkAccesCall = {
            "id": check_access_id,
            "jsonrpc": "2.0",
            "method": "hasAccessRight",
            "params": {
                "clientId": varb.clientId,
                "clientSecret": varb.clientSecret
            }
        }

        ws.send(JSON.stringify(checkAccesCall))
        ws.onmessage = (event) => {
            try {
                let data = JSON.parse(event.data);
                if (data.id === check_access_id) {
                    if (data.result.accessGranted === true) {
                        console.log("Access granted!")
                        resolve(true);
                    } else {
                        console.log("Access needed")
                        resolve(false);
                    }
                }
            }
            catch (error) {
                console.log(error);
                reject(error);
            }
        }
    })

}

///method to request access to the BCI data
export const requestAccess = (webSocket) => {
    const request_access_id = 3;
    let ws = webSocket;

    //request access only called once ever
    let accessCall = {
        "id": request_access_id,
        "jsonrpc": "2.0",
        "method": "requestAccess",
        "params": {
            "clientId": varb.clientId,
            "clientSecret": varb.clientSecret
        }
    }

    ws.send(JSON.stringify(accessCall))
    ws.onmessage = (event) => {
        try {
            let data = JSON.parse(event.data);
            if (data.id === request_access_id) {
                console.log("Access needed. Please check the emotiv launcher. Press button again after giving access")
            }
        }
        catch (error) {
            console.log(error);
        }
    }
}

//method to getl ist of connected headsets and set the id
export const queryHeadsets = (webSocket) => {
    return new Promise(function (resolve, reject) {
        const query_headset_id = 4;
        let ws = webSocket;

        //get list of headsets
        let queryCall = {
            "id": query_headset_id,
            "jsonrpc": "2.0",
            "method": "queryHeadsets"
        }

        ws.send(JSON.stringify(queryCall))
        ws.onmessage = (event) => {
            try {
                let data = JSON.parse(event.data);
                if (data.id === query_headset_id) {
                    if (data.result.length > 0) {
                        console.log("Headset found: " + data.result[0].id)
                        resolve(data.result[0].id);
                    }
                    else {
                        console.log("there are no headsets connected")
                        reject("no headset found")
                    }
                }
            }
            catch (error) {
                console.log(error);
                reject(error)
            }
        }
    })

}

//method to make a connection with the headset. Needed to get data stream
export const controlHeadset = (webSocket, headsetId) => {
    return new Promise(function (resolve, reject) {
        const control_device_id = 5;
        let ws = webSocket;

        //connect to the headset
        let connectCall = {
            "id": control_device_id,
            "jsonrpc": "2.0",
            "method": "controlDevice",
            "params": {
                "command": "connect",
                "headset": headsetId
            }
        }

        ws.send(JSON.stringify(connectCall))
        ws.onmessage = (event) => {
            try {
                let data = JSON.parse(event.data);
                if (data.id === control_device_id) {
                    if (typeof data.result != "undefined") {
                        console.log("Headset has been connected");
                        resolve(true);
                    } else {
                        console.log("Headset did not connect")
                        resolve(false);
                    }

                }
            }
            catch (error) {
                console.log(error);
                reject(error)
            }
        }
    })

}

//method to get cortex token for later usage
export const authorize = (webSocket) => {
    return new Promise(function (resolve, reject) {
        const request_token_id = 6;
        let ws = webSocket;

        //get cortex token for later use
        let tokenCall = {
            "id": request_token_id,
            "jsonrpc": "2.0",
            "method": "authorize",
            "params": {
                "clientId": varb.clientId,
                "clientSecret": varb.clientSecret,
                "debit": 100
            }
        }

        ws.send(JSON.stringify(tokenCall))
        ws.onmessage = (event) => {
            try {
                let data = JSON.parse(event.data);
                if (data.id === request_token_id) {
                    resolve(data.result.cortexToken);
                    console.log("Cortex token received");

                }
            }
            catch (error) {
                console.log(error);
                reject(error);
            }
        }
    })

}

//method to check if a profile is selected
export const checkCurrentProfile = (webSocket, cortexToken, headsetId) => {
    return new Promise(function (resolve, reject) {
        const check_profile_id = 7;
        let ws = webSocket;

        //get the currently used training profile
        let checkProfileCall = {
            "id": check_profile_id,
            "jsonrpc": "2.0",
            "method": "getCurrentProfile",
            "params": {
                "cortexToken": cortexToken,
                "headset": headsetId
            }
        }
        ws.send(JSON.stringify(checkProfileCall))
        ws.onmessage = (event) => {
            try {
                let data = JSON.parse(event.data);
                if (data.id === check_profile_id) {
                    if (data.result.name != null) {
                        console.log("profile selected: " + data.result.name)
                        resolve(true);
                    } else {
                        console.log("no profile selected yet")
                        resolve(false);
                    }
                }
            }
            catch (error) {
                console.log(error);
                reject(error);
            }
        }
    })

}

//method to set a profile
export const selectProfile = (webSocket, cortexToken, headsetId, profileToLoad) => {
    return new Promise(function (resolve, reject) {
        const select_profile_id = 8;
        let ws = webSocket;

        //set the used training profile
        let selectProfileCall = {
            "id": select_profile_id,
            "jsonrpc": "2.0",
            "method": "setupProfile",
            "params": {
                "cortexToken": cortexToken,
                "headset": headsetId,
                "profile": profileToLoad,
                "status": "load"
            }
        }

        ws.send(JSON.stringify(selectProfileCall))
        ws.onmessage = (event) => {
            try {
                let data = JSON.parse(event.data);
                if (data.id === select_profile_id) {
                    if (data.result.action === "load") {
                        console.log("profile selected successfully: " + data.result.name)
                        resolve(true);
                    }
                }
            }
            catch (error) {
                console.log(error);
                reject(error);
            }
        }
    })

}

//Start session for data streaming
export const createSession = (webSocket, cortexToken, headsetId) => {
    return new Promise(function (resolve, reject) {
        const create_session_id = 9;
        let ws = webSocket;

        //start session with cortex token for data stream
        let createSessionCall = {
            "id": create_session_id,
            "jsonrpc": "2.0",
            "method": "createSession",
            "params": {
                "cortexToken": cortexToken,
                "headset": headsetId,
                "status": "active"
            }
        }

        ws.send(JSON.stringify(createSessionCall))
        ws.onmessage = (event) => {
            try {
                let data = JSON.parse(event.data);
                if (data.id === create_session_id) {
                    if (typeof data.result != "undefined") {
                        console.log("Session successfully started")
                        resolve(data.result.id);
                    } else {
                        console.log("Session not created")
                        console.log(data)
                    }

                }
            }
            catch (error) {
                console.log(error);
                reject(error);
            }
        }
    })

}

//subscribe to channel that will stream mental commands
export const subscribe = (subscribeStatus, webSocket, cortexToken, sessionId) => {
    const subscribe_id = 10;
    let ws = webSocket;

    //start session json
    const subscribeCall = {
        "id": subscribe_id,
        "jsonrpc": "2.0",
        "method": subscribeStatus,
        "params": {
            "cortexToken": cortexToken,
            "session": sessionId,
            "streams": ["com", "fac", "eq"]
        }
    }

    ws.send(JSON.stringify(subscribeCall))
    ws.onmessage = (event) => {
        try {
            let data = JSON.parse(event.data);
            if (data.id === subscribe_id) {
                console.log(data);
                return true;
            }
        }
        catch (error) {
            console.log(error);
        }
    }
}
