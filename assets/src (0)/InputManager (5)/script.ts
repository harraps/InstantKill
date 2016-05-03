class InputManager {
    
    public static names : string[] = [
        // movement
        "moveF","moveB",
        "moveL","moveR",
        // jump
        "jump",
        // fire and hook
        "fire","hook",
    ];
    
    public mouse : number[];
    public keys1 : string[];
    public keys2 : string[];
    
    public constructor( layout? : string ){
        // we create our arrays
        this.mouse = [];
        this.keys1 = [];
        this.keys2 = [];
        
        this.reset(layout);
    }
    
    public reset( layout? : string ){
        // move controls
        this.keys1["moveF"] = "W";
        this.keys1["moveB"] = "S";
        this.keys1["moveL"] = "A";
        this.keys1["moveR"] = "D";
        
        // jump and hook(bis)
        this.keys1["jump"] = "SPACE";
        this.keys1["hook"] = "SHIFT";
        //this.keys2["hook"] = "SPACE";
        
        // arms controls
        this.mouse["fire"] = 0; // left  click
        this.mouse["hook"] = 2; // right click
        
        // we change the input based on the selected keyboard layout
        switch( layout ){
            case "QWERTY": // English
            case "QWERTZ": // German
                break;
            case "AZERTY": // French
                this.keys1["moveF"] = "Z";
                this.keys1["moveL"] = "Q";
                break;
            case "QZERTY": // Italian
                this.keys1["moveF"] = "Z";
        }
    }
    
    public setInput( array : number, input : string, control : number|string ){
        switch( array ){
            case 0 : this.mouse[input] = control; break;
            case 1 : this.keys1[input] = control; break;
            case 2 : this.keys2[input] = control; break;
        }
    }
    
    // return true if the input is down wherever it is a mouse button or one of the two possible keys
    public isInputDown( input : string ) : boolean{
        // we check each array with the right function
        if( InputManager.checkInput(this.mouse, Sup.Input.isMouseButtonDown, input) ) return true;
        if( InputManager.checkInput(this.keys1, Sup.Input.isKeyDown, input) ) return true;
        if( InputManager.checkInput(this.keys2, Sup.Input.isKeyDown, input) ) return true;
        return false;
    }
    
    // return true if the input was just pressed wherever it is a mouse button or one of the two possible keys
    public wasInputJustPressed( input : string ) : boolean{
        // we check each array with the right function
        if( InputManager.checkInput(this.mouse, Sup.Input.wasMouseButtonJustPressed, input) ) return true;
        if( InputManager.checkInput(this.keys1, Sup.Input.wasKeyJustPressed, input) ) return true;
        if( InputManager.checkInput(this.keys2, Sup.Input.wasKeyJustPressed, input) ) return true;
        return false;
    }
    
    // return true if the input was just released wherever it is a mouse button or one of the two possible keys
    public wasInputJustReleased( input : string ) : boolean{
        // we check each array with the right function
        if( InputManager.checkInput(this.mouse, Sup.Input.wasMouseButtonJustReleased, input) ) return true;
        if( InputManager.checkInput(this.keys1, Sup.Input.wasKeyJustReleased, input) ) return true;
        if( InputManager.checkInput(this.keys2, Sup.Input.wasKeyJustReleased, input) ) return true;
        return false;
    }
    
    // check if input is set and call the function on the input
    private static checkInput( array : number[]|string[], call : Function, input : string ) : boolean{
        // if the input is set in the array
        // we call the function with the specified input
        if( array[input] != null ) return call( array[input] );
    }

}