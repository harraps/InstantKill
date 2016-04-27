class PlayerMove {
    
    private ctrl : PlayerController;
    
    public constructor(controller : PlayerController) {
        this.ctrl = controller;
    }

    public update() {
        // we recover the info we need to move the player
        let speed = this.ctrl.moveSpeed;
        let angle = this.ctrl.look.angle.x;
        let input = this.ctrl.input.Move;
        let body  = this.ctrl.actor.cannonBody.body;
        
        // we create a new vector to set up the velocity of the controller
        let velocity = new CANNON.Vec3();
        // we calculate the new velocity based on the inputs of the player
        velocity.x = ( input.x*Math.cos(angle) -input.y*Math.sin(angle)) * speed;
        velocity.z = (-input.x*Math.sin(angle) -input.y*Math.cos(angle)) * speed;
        // but we keep the same vertical velocity
        velocity.y = body.velocity.y;
        // if we are on the ground
        if( this.ctrl.ground.grounded ){
            // if the player wants to jump, we apply a vertical velocity
            if( this.ctrl.input.Jump ) velocity.y = this.ctrl.jumpForce;
        } else { // we are in the air
            // the new velocity is influenced by the old one
            velocity.x += body.velocity.x;
            velocity.z += body.velocity.z;
            velocity.x *= 0.5;
            velocity.z *= 0.5;
        }
        // we apply the velocity
        body.velocity = velocity;
    }
}
