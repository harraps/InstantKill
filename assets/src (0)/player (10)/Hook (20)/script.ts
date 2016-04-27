/**
 * The hook work on a toggle mode to help the player aim while being drag by his grappling hook
 */
class PlayerHook {
    
    private static maxSpeed : number = 500; // max speed while being dragged
    
    private ctrl : PlayerController;
    
    // platform body to which our grappling hook is attached to
    private platform : CANNON.Body;
    private anchor   : Sup.Math.XYZ; // local position of the anchor
    
    public constructor( controller : PlayerController ) {
        this.ctrl = controller;
    }

    public update() {
        let input = this.ctrl.input.Hook;
        let wire  = this.ctrl.wire;
        
        // if the player just pressed the hook key
        if(input){
            // if we're already attached to a platform
            if(this.platform){
                this.platform = null;   // we detached from it
                wire.setVisible(false); // the wire is not visible anymore
            }else{ // we're not attached to a platform
                let result = this.ctrl.look.raycast();
                // if we hit something
                if(result.hasHit){
                    // we recover the platform
                    this.platform = result.body;
                    // we want the local position of the anchor, in case the platform would move
                    this.anchor = result.hitPointWorld.vsub(this.platform.position);
                    wire.setVisible(true);
                }
            }
        }
        // if the hook is attached to a platform
        if(this.platform){
            // we recover the global position of the anchor
            let position  = Util.getSupVec(this.platform.position).add(this.anchor);
            let direction = position.clone().subtract(this.ctrl.actor.getPosition());
            let distance  = direction.length();
            
            // we change the velocity of the body based on the distance from the anchor
            let body = this.ctrl.actor.cannonBody.body;
            // if the distance is higher than the maximum speed, we cap the value
            if(distance > PlayerHook.maxSpeed) direction.normalize().multiplyScalar(PlayerHook.maxSpeed);
            // we add the velocity to the body
            body.velocity.vadd(Util.getCannonVec(direction));
            
            // we set the wire orientation and length of the wire
            wire.lookAt(position);
            wire.setLocalScaleZ(distance);
        }
        
    }
    
}
