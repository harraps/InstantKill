class PlayerController extends Sup.Behavior {
    
    // editable attributes:
    // look
    public sensitivity : number = 0.6; // mouse look sensitivity
    // move
    public moveSpeed   : number = 20; // speed of the body
    public jumpForce   : number = 30; // force applied to the body when jumping
    public dashSpeed   : number = 80; // speed of the body while in dash
    public dashTime    : number = 60; // time of the dash in frames
    // ground
    public steepSlope  : number = 50; // how steep is the ground the player can walk on
    // gun
    public fireRate    : number = 60; // fire rate of the gun in frames
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
        this.trail   = this.actor.getChild("Trail"  );
        this.wire    = this.actor.getChild("Wire"   );
        // we don't want the trail to follow the player around, so we unparent it
        this.trail.setParent(null);
        // both trail and wire should be displayed only when necessary
        this.trail.setVisible(false);
        this.wire .setVisible(false);
        
        let body = this.actor.cannonBody.body;
        this.collider = <CANNON.Cylinder> body.shapes[0];
        body.material = Game.world.material;
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
    }

    public update() {
        this.input .update();
        this.status.update();
        this.look  .update();
        this.move  .update();
        this.ground.update();
        this.gun   .update();
        this.hook  .update();
    }
    
    public onDestroy(){
        //Game.world.removeStatus();
        Game.world.removeGround(this.ground);
        // we also need the destroy the trail since it's no longer attached to the controller
        this.trail.destroy();
    }
    
}
Sup.registerBehavior(PlayerController);