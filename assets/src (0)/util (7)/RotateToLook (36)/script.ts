class RotateToLook extends Sup.Behavior {
    private head : Sup.Actor;
    
    public start() {
        let actor = Sup.getActor("Player");
        if(actor){
            let controller = actor.getBehavior(PlayerController);
            this.head = controller.head;
        }
    }

    public update() {
        if(this.head) this.actor.setOrientation(this.head.getOrientation());
    }
}
Sup.registerBehavior(RotateToLook);
