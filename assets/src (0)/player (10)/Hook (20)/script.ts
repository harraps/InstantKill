/**
 * The hook work on a toggle mode to help the player aim while being drag by his grappling hook
 */
class PlayerHook {
    
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
        
        // if the player is holding the hook key
        if(input){
            // if we're already attached to a platform
            if(!this.platform){ // we're not attached to a platform
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
        }else if(this.platform){ // the player released the hook, but we are still anchored
            this.platform = null; // we detach from the platform
            wire.setVisible(false); // the wire is not visible anymore
        }
        // if the hook is attached to a platform
        if(this.platform){
            // we recover the global position of the anchor
            let position  = Util.getSupVec(this.platform.position).add(this.anchor);
            let direction = position.clone().subtract(this.ctrl.actor.getPosition());
            let distance  = direction.length();
            
            // we change the velocity of the body based on the distance from the anchor
            let body = this.ctrl.actor.cannonBody.body;
            if(distance < 1) direction.normalize();
            // we increase the force of the hook
            direction.multiplyScalar(this.ctrl.hookForce);
            direction.y *= 0.5; // we reduce the force vertically to avoid bouncing effect
            if(direction.y < 0) direction.y = 0;
            // we add the velocity to the body
            body.applyLocalForce(Util.getCannonVec(direction),body.position);
            
            // we set the wire orientation and length of the wire
            wire.lookAt(position);
            wire.setLocalScaleZ(distance);
        }
        
    }
    
}
