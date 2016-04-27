// allow to recover player inputs as preprocessed values
class PlayerInput {
    
    private jumpCounter : number;
    
    public constructor() {
        this.jumpCounter = 0;
    }
    
    public update() {
        // if the player just pressed the jump key, he wants to jump
        if(Game.inputManager.wasInputJustPressed("jump")) this.jumpCounter = 10;
        // if the counter is set, we decrement it
        if(this.jumpCounter > 0) --this.jumpCounter;
    }
    
    // return mouse movement
    public get Look() : Sup.Math.XY {
        return Sup.Input.getMouseDelta();
    }
    
    // return normalized key inputs
    public get Move() : Sup.Math.XY {
        // we need a vector to normalize it
        let move = new Sup.Math.Vector2();
        // we change the direction based on each input
        if(Game.inputManager.isInputDown("moveF")) ++move.y;
        if(Game.inputManager.isInputDown("moveB")) --move.y;
        if(Game.inputManager.isInputDown("moveL")) --move.x;
        if(Game.inputManager.isInputDown("moveR")) ++move.x;
        // if either x or y is not null, we normalize the vector
        if(move.x || move.y) move.normalize();
        return move;
    }
    
    // return true if the player will jump and reset the counter
    public get Jump() : boolean {
        // if the player pressed the jump in the last milliseconds, he can jump
        if(this.jumpCounter > 0){
            // we don't want the player to make a second jump right after the first one
            this.jumpCounter = 0;
            return true;
        }
        return false;
    }
    
    // true if the player just pressed the fire button
    public get Fire() : boolean {
        return Game.inputManager.wasInputJustPressed("fire");
    }
    
    // true if the player is holding the hook key
    public get Hook() : boolean {
        return Game.inputManager.wasInputJustPressed("hook");
    }
}
