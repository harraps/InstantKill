class PlayerStatus implements IStatus {
    private static impactDistance : number = 5*5;
    
    private ctrl : PlayerController;
    
    public id : number; // ID of the player server side
    
    public constructor(controller : PlayerController) {
        this.ctrl = controller;
        let body = this.ctrl.actor.cannonBody.body;
        Game.world.addStatus(body.id, this);
    }
    public damage(attacker : IStatus){
        // TODO create player model with wireframe effect and orbiting camera
    }
    public propels(force : number, point : CANNON.Vec3){
        let body = this.ctrl.actor.cannonBody.body;
        // we create a vector to know the direction of propulsion
        let direction = body.position.vsub(point);
        
        // if the point of impact is close enough
        if( direction.lengthSquared() < PlayerStatus.impactDistance ){
            // we normalize the force
            direction.normalize();
            direction = direction.mult(force);
            Sup.log(direction.length());
            // we apply the force
            body.applyImpulse(direction, point);
        }
    }
}
