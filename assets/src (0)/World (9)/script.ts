class World {
    
    // default material to apply
    public material : CANNON.Material;
    
    // holds the status of the player of the game
    protected status : {[key:number]:IStatus}; // we use a map instead of a list to avoid null values
    
    // holds the ground modules to update
    protected grounds : IGround[];
    
    public constructor(){
        let world = Sup.Cannon.getWorld();
        world.gravity.set(0, -6000, 0);
        world.defaultContactMaterial.friction = 0.1;
        
        this.material = new CANNON.Material("material");
        world.addContactMaterial(new CANNON.ContactMaterial(this.material, world.defaultMaterial, {
            friction: 0,
            restitution: 0,
            contactEquationStiffness: 1e8,
            contactEquationRelaxation: 3
        }));
        // we create the arrays to contains our game elements
        this.status = {};
        this.grounds = [];
    }
    
    public getStatus(id : number){
        return this.status[id];
    }
    public addStatus(status : IStatus){
        this.status[status.id] = status;
    }
    public removeStatus(status : IStatus){
        delete this.status[status.id];
    }
    
    public addGround(ground : IGround){
        this.grounds[this.grounds.length] = ground;
    }
    public removeGround( ground : IGround ){
        let index = this.grounds.indexOf(ground);
        if(index > -1) this.grounds.splice(index, 1);
    }
    
    // we extends the behavior of CANNON.world to update the IGrounds before the velocites are applied
    private editStepFunction(){
        let world = Sup.Cannon.getWorld();
        // we recover the prototype and the old step function
        var oldPrototype = world.step.prototype;
        var oldStep = world.step;
        var match = this;
        // we change the step function
        world.step = function(){
            // we update the IGrounds
            for( let ground of match.grounds ){
                ground.updatePosition();
            }
            // we execute the default behavior of CANNON.world
            oldStep.apply(this,arguments);
        };
        // we reapply the prototype
        world.step.prototype = oldPrototype;
    }
}

interface IStatus {
    id : number;
    damage( attacker : IStatus );
}

interface IGround {
    updatePosition();
}