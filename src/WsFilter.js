//counter values facial commands
var winkL = 0;
var winkR = 0;
var blink = 0;
var furrow = 0;
var raise = 0;
var smile = 0;
var clench = 0;

//timer for facial commands.
//reset the counters to 0 every second.
const clearCounterFac = () => {
    winkL = 0;
    winkR = 0;
    blink = 0;
    furrow = 0;
    raise = 0;
    smile = 0;
    clench = 0;
}
setInterval(clearCounterFac, 1000);


//counter values mental commands
var left = 0;
var right = 0;
var up = 0;
var down = 0;

//timer for mental commands.
//reset the counters to 0 every second.
const clearCounterCom = () => {
    left = 0;
    right = 0;
    up = 0;
    down = 0;
}
setInterval(clearCounterCom, 1000);

//method to split facial from mental commands
export const filterCommand = (command) => {
    switch (command.type) {
        case "fac":
            return filterFac(command);
        case "com":
            return filterCom(command);
    }
}

//face filter
const filterFac = (command) => {
    switch (command.action) {
        case "winkL":
            winkL++;
            if (winkL === 10) {
                winkL = 0;
                return command;
            }
            break;
        case "winkR":
            winkR++;
            if (winkR === 10) {
                winkR = 0;
                return command;
            }
            break;
        case "blink":
            blink++;
            if (blink === 10) {
                blink = 0;
                return command;
            }
            break;
        case "furrow":
            furrow++;
            if (furrow === 10) {
                furrow = 0;
                return command;
            }
            break;
        case "raise":
            raise++;
            if (raise === 10) {
                raise = 0;
                return command;
            }
            break;
        case "smile":
            smile++;
            if (smile === 10) {
                smile = 0;
                return command;
            }
            break;
        case "clench":
            clench++;
            if (clench === 10) {
                clench = 0;
                return command;
            }
            break;
    }
}

//command filter
const filterCom = (command) => {
    switch (command.action) {
        case "left":
            left++;
            if (left === 5) {
                left = 0;
                return command;
            }
            break;
        case "right":
            right++;
            if (right === 5) {
                right = 0;
                return command;
            }
            break;
        case "up":
            up++;
            if (up === 5) {
                up = 0;
                return command;
            }
            break;
        case "down":
            down++;
            if (down === 5) {
                down = 0;
                return command;
            }
            break;

    }
}