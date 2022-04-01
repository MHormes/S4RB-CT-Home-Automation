//counter values facial commands
var winkL = 0;
var winkR = 0;
var blink = 0;
var furrow = 0;
var raise = 0;
var smile = 0;
var clench = 0;

//timer for facial commands.
//reset the counters to 0 every 0.5 seconds.
//results in data output that is 'handelbaar'
const clearCounterFac = () => {
    winkL = 0;
    winkR = 0;
    blink = 0;
    furrow = 0;
    raise = 0;
    smile = 0;
    clench = 0;
    //console.log("cleared");
} 
setInterval(clearCounterFac, 1000);

//method to split facial from mental commands
export const filterCommand = (command) => {
    switch (command.type) {
        case "fac":
            filterFac(command);
            break;
        case "com":
            filterCom(command);
            break;
    }
}

//face filter
const filterFac = (command) => {
    switch (command.action) {
        case "winkL":
            winkL++;
            if (winkL === 5) {
                command.printCommand();
                winkL = 0;
            }
            break;
        case "winkR":
            winkR++;
            if (winkR === 5) {
                command.printCommand();
                winkR = 0;
            }
            break;
        case "blink":
            blink++;
            if (blink === 5) {
                command.printCommand();
                blink = 0;
            }
            break;
        case "furrow":
            furrow++;
            if (furrow === 5) {
                command.printCommand();
                furrow = 0;
            }
            break;
        case "raise":
            raise++;
            if (raise === 5) {
                command.printCommand();
                raise = 0;
            }
            break;
        case "smile":
            smile++;
            if (smile === 5) {
                command.printCommand();
                smile = 0;
            }
            break;
        case "clench":
            clench++;
            if (clench === 10) {
                command.printCommand();
                clench = 0;
            }
            break;
    }
}

//command filter
const filterCom = (command) => {
    switch (command.action) {
        case "":
            break;
        case "":
            break;
    }
}