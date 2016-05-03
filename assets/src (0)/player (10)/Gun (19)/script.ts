/**
 * the gun of the game is an instantgib gun, so there is no need for health or damage values
 */
class PlayerGun {
    
    private ctrl : PlayerController;
    
    private recoilTimer : number;
    private trailTimer  : number;
    
    public constructor( controller : PlayerController ) {
        this.ctrl = controller;
        this.recoilTimer = 0;
        this.trailTimer  = 0;
    }

    public update() {
        let input = this.ctrl.input.Fire;
        let blast = this.ctrl.blast;
        let trail = this.ctrl.trail;
        
        // if the recoil timer is set, we deacrement it
        if(this.recoilTimer > 0) --this.recoilTimer;
        
        // if the trail timer is set
        if(this.trailTimer > 0){
            --this.trailTimer; // we deacrement the timer
            // we update the opacity of the trail
            let opacity = this.trailTimer*0.03;
            trail.modelRenderer.setOpacity(opacity);
            blast.modelRenderer.setOpacity(opacity);
            // if we passed the limit, the trail is no longer visible
            if(this.trailTimer <= 0){
                blast.setVisible(false);
                trail.setVisible(false);
            }
            
        }
        
        // if the player wants to fire and the recoil is over
        if( input && this.recoilTimer <= 0 ){
            // we reset the recoil timer and the trail timer
            this.recoilTimer = this.ctrl.fireRate;
            this.trailTimer  = 30; // the trail effect will last for half a second
            
            // we cast a ray in the direction of the look
            let result = this.ctrl.look.raycast();
            // if we hit something
            if( result.hasHit ){
                // we hit something so we display a blast
                blast.setVisible(true);
                blast.modelRenderer.setOpacity(1);
                blast.setPosition(result.hitPointWorld);
                
                // we recover the status of the collided object
                let status = Game.world.getStatus(result.body.id);
                // if the hit body has a status, we damage it
                if(status) status.damage(this.ctrl.status);
            }
            
            // we update the trail effect
            let emitter = this.ctrl.emitter.getPosition();
            // the trail should be plainly visible and placed in the right location / right orientation
            trail.setVisible(true);
            trail.modelRenderer.setOpacity(1);
            trail.setPosition(emitter);
            trail.lookAt(result.hitPointWorld);
            trail.setLocalScaleZ( emitter.distanceTo(result.hitPointWorld) );
        }
    }
}
