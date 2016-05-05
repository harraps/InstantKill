class PlayerController extends Sup.Behavior {
    private static maxSpeed : number = 100;
    
    // editable attributes:
    // look
    public sensitivity : number = 0.6; // mouse look sensitivity
    // move
    public moveSpeed   : number = 20; // speed of the body
    public jumpForce   : number = 30; // force applied to the body when jumping
    // ground
    public steepSlope  : number = 50; // how steep is the ground the player can walk on
    // gun
    public fireRate    : number = 60;  // fire rate of the gun in frames
    public propelForce : number = 200; // propeling force of the impact when shooting at your feet
    // hook
    public hookForce   : number = 40; // force applied to the body when hooked
    
    // modules of the player controller
    public input  : PlayerInput;
    public status : PlayerStatus;
    public look   : PlayerLook;
    public move   : PlayerMove;
    public ground : PlayerGround;
    public gun    : PlayerGun;
    public hook   : PlayerHook;
    
    // actors:
    public torso   : Sup.Actor; // allow to rotate the player horizontally
    public head    : Sup.Actor; // allow to rotate the camera up and down
    public emitter : Sup.Actor; // allow to set the position of the trail
    public blast   : Sup.Actor; // blast effect to display when we shoot on something
    public trail   : Sup.Actor; // trail effect of the gun
    public wire    : Sup.Actor; // wire of the grappling hook
    
    // physics attributes
    public collider : CANNON.Cylinder;
    public bottom   : CANNON.Vec3;
    
    public awake() {
        // we need to recover our actors
        this.torso   = this.actor.getChild("Torso"  );
        this.head    = this.actor.getChild("Head"   );
        this.emitter = this.actor.getChild("Emitter");
        this.blast   = this.actor.getChild("Blast"  );
        this.trail   = this.actor.getChild("Trail"  );
        this.wire    = this.actor.getChild("Wire"   );
        // we don't want the trail to follow the player around, so we unparent it
        this.blast.setParent(null);
        this.trail.setParent(null);
        // both trail and wire should be displayed only when necessary
        this.blast.setVisible(false);
        this.trail.setVisible(false);
        this.wire .setVisible(false);
        
        let body = this.actor.cannonBody.body;
        body.material = Game.world.material;
        this.collider = <CANNON.Cylinder> body.shapes[0];
        // we recover the bottom right vertice of the collider and copy it
        this.bottom = this.collider.vertices[0].clone();
        this.bottom.x = 0; // we push the vertice in the center of the face
        
        // we initialize each player module
        this.input  = new PlayerInput ();
        this.status = new PlayerStatus(this);
        this.look   = new PlayerLook  (this);
        this.move   = new PlayerMove  (this);
        this.ground = new PlayerGround(this);
        this.gun    = new PlayerGun   (this);
        this.hook   = new PlayerHook  (this);
        
        Game.world.player = this;
    }

    public update() {
        this.input .update();
        //this.status.update();
        this.look  .update();
        this.move  .update();
        this.ground.update();
        this.gun   .update();
        this.hook  .update();
        // we prevent the controller to go too fast
        let body = this.actor.cannonBody.body;
        let max  = PlayerController.maxSpeed;
        if(body.velocity.lengthSquared() > max*max){
            body.velocity.normalize();
            body.velocity = body.velocity.scale(max);
        }
    }
    
    public onDestroy(){
        //Game.world.removeStatus();
        Game.world.removeGround(this.ground);
        // we also need the destroy the trail since it's no longer attached to the controller
        this.blast.destroy();
        this.trail.destroy();
    }
    
}
Sup.registerBehavior(PlayerController);