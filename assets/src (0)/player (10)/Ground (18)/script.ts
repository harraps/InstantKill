class PlayerGround {
    
    private ctrl : PlayerController;
    
    public grounded : boolean;
    
    protected platform  : CANNON.Body;
    protected globalPos : CANNON.Vec3;
    protected localPos  : CANNON.Vec3;
    protected globalRot : CANNON.Quaternion;
    protected localRot  : CANNON.Quaternion;
    
    public constructor(controller : PlayerController) {
        this.ctrl = controller;
        this.grounded = false;
        Game.world.addGround(this);
    }

    public update() {
        // we reset the grounded variable
        this.grounded = false;
        // we try the center of the face first
        // the player has a ground beneath it's feet, we don't need to check the other contact points
        if(this.checkGround(this.ctrl.bottom)) return;
        // we check each even vertice
        let vertices = this.ctrl.collider.vertices;
        for( let i=0; i<vertices.length; i += 2 ){
            // we found atleast one contact, we don't need to check the other contact points
            if(this.checkGround(vertices[i])) return;
        }
        // we have check all of the contact points, we are sure the player is not on the ground
        this.platform = null;
    }
    
    public updatePosition(){
        // if we are on a platform
        if(this.platform){
            let body = this.ctrl.actor.cannonBody.body;
            // we calculate the movement of the platform since the last update
            let newGlobalPos = this.platform.pointToWorldFrame( this.localPos );
            let moveDistance = newGlobalPos.vsub( this.globalPos );
            // we apply the movement to the player
            body.position = body.position.vadd( moveDistance );
            
            // we calculate the rotation of the platform since the last update
            let newGlobalRot = this.platform.quaternion.mult( this.localRot );
            let rotationDiff = newGlobalRot.mult( this.globalRot.inverse() );
            // we need to make sure the player stay upright
            let vec = new CANNON.Vec3();
            rotationDiff.toEuler(vec);
            // we only rotate the player on the Y-axis
            this.ctrl.look.addRotation(vec.y);
        }
    }
    
    public updatePlatform(){
        // if we are on a platform
        if(this.platform){
            let body = this.ctrl.actor.cannonBody.body;
            // we recover the position of the platform for the next update
            this.globalPos = body.position;
            this.localPos  = this.platform.pointToLocalFrame( body.position );
            // we recover the rotation of the platform for the next update
            this.globalRot = body.quaternion;
            this.localRot  = this.platform.quaternion.inverse().mult( body.quaternion );
        }
    }
    
    // this function is called for each contact point of the bottom of the cylinder
    protected checkGround( vertice : CANNON.Vec3 ) : boolean {
        // we create the contact point
        let contact = Util.getCannonVec(this.ctrl.actor.getPosition());
        contact.x += vertice.x;
        contact.y += vertice.z;
        contact.z -= vertice.y;
        // we create our vectors
        let from = contact; // we don't need to clone
        let to   = contact.clone();
        // we add padding to both vector
        from.y +=  0.1;
        to  .y += -0.5;
        let ray = new CANNON.Ray(from, to);
        // we perform the raycast
        ray.intersectWorld(Sup.Cannon.getWorld(), {collisionFilterMask: -1, collisionFilterGroup: -1, skipBackfaces:true});
        // if we hit something with our raycast
        if(ray.hasHit){
            // we compare the hit normal to the vector up
            let normal = Util.getSupVec(ray.result.hitNormalWorld).angleTo(Sup.Math.Vector3.up());
            // if the angle from the normal to the vector up is lower than the steep slope limit
            if( normal < this.ctrl.steepSlope ){
                // at least one contact returned true
                this.grounded = true;
                // if the platform we landed on is KINEMATIC
                if( ray.result.body.type == CANNON.Body.KINEMATIC ){
                    // we keep track of the platform we landed on
                    let platformChange = this.platform != ray.result.body;
                    this.platform = ray.result.body;
                    // we changed of platform
                    if( platformChange ){
                        // we need to update the platform
                        this.updatePlatform();
                    }
                }else{
                    // we landed on a non kinematic platform
                    this.platform = null;
                    // we cannot support moving platform if the platform is not kinematic
                }
                return true;
            }
        }
        // we didn't hit something, we are not grounded
        return false;
    }
    
}
