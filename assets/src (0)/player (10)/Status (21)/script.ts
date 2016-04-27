class PlayerStatus implements IStatus {
    
    private ctrl : PlayerController;
    
    public id : number;
    
    public constructor(controller : PlayerController) {
        this.ctrl = controller;
        this.id = this.ctrl.actor.cannonBody.body.id;
    }
    
    public damage(attacker : IStatus){
        
    }
    
    public update() {
        
    }
}
