export default class Command {

    type;
    action;
    strength;

    constructor(type, action, strength){
        this.type = type;
        this.action = action;
        this.strength = strength;
    }

    printCommand(){
        console.log(this.action);
    }
}