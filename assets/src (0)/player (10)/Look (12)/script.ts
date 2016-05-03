class PlayerLook {
    
    private ctrl : PlayerController;
    
    public angle : Sup.Math.XY;
    
    public constructor( controller : PlayerController ) {
        this.ctrl  = controller;
        this.angle = { x:0, y:0 };
    }

    public update() {
        // we recover the inputs of the player
        let input = this.ctrl.input.Look;
        
        // we apply the sensitivity to our inputs
        input.x *= -this.ctrl.sensitivity;
        input.y *=  this.ctrl.sensitivity;
        
        // we rotate the torso horizontally
        this.ctrl.torso.rotateLocalEulerY(input.x); // we rotate on the Y-axis
        this.angle.x += input.x;
        this.angle.x %= Util.TAU;
        
        // we rotate the head vertically
        this.ctrl.head.rotateLocalEulerX(input.y);
        this.angle.y += input.y;
        
        // we clamp the movement of the head
        if( this.angle.y > Util.hPI ){ // we clamp the value upward
            this.ctrl.head.setLocalEulerX(Util.hPI);
            this.angle.y = Util.hPI;
        }else if( this.angle.y < -Util.hPI ){ // we clamp the value downward
            this.ctrl.head.setLocalEulerX(-Util.hPI);
            this.angle.y = -Util.hPI;
        }
    }
    
    // add the rotation on the horizontal plane
    public addRotation( angle : number ){
        angle %= Util.TAU;
        // we add rotation to our player
        this.ctrl.torso.rotateLocalEulerY(angle);
        this.angle.x += angle;
    }
    
    // perform a raycast in the direction the player is looking
    public raycast( filter : number = -1 ){
        // the camera is attached to the "Head" actor
        let head = this.ctrl.head;
        
        let pos = head.getPosition(); // position of the controller
        // we create a ray of 10,000 units long
        let des = new Sup.Math.Vector3(0,0,-10000); // destination point
        // we rotate the direction of the vector so it's pointing in the same way as the camera
        des.rotate(head.getOrientation()).add(pos);
        // we create our ray
        let from = Util.getCannonVec(pos);
        let to   = Util.getCannonVec(des);
        let ray  = new CANNON.Ray(from, to);
        ray.intersectWorld(Sup.Cannon.getWorld(), { mode: CANNON.Ray.CLOSEST, collisionFilterMask: filter, collisionFilterGroup: -1, skipBackfaces: true });
        // even if the ray has not hit, we want the hitpoint to be setted
        if(!ray.result.hasHit) ray.result.hitPointWorld = to;
        // we return the result of the raycast
        return ray.result;
    }
}
