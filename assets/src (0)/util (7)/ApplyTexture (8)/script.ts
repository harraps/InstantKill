// this behavior allow us to apply a custom texture to the model
class ApplyTexture extends Sup.Behavior {
    
    // will hold all of the materials to reapply them to future models
    private static materials = [];
    
    public texture : string; // path to the texture to apply
    
    awake() {
        // if the texture is set
        if( this.texture ){
            // if the material is not in the list yet
            if( !ApplyTexture.materials[this.texture] ){
                // we add a sprite to our actor
                new Sup.SpriteRenderer(this.actor, this.texture);
                // we store the material of the sprite
                ApplyTexture.materials[this.texture] = (<any>this.actor.spriteRenderer).__inner.threeMesh.material;
                // we don't need the sprite anymore
                this.actor.spriteRenderer.destroy();
            }
            // if the actor has a model renderer
            if( this.actor.modelRenderer ){
                // we apply the material we have previously stored
                (<any>this.actor.modelRenderer).__inner.threeMesh.material = ApplyTexture.materials[this.texture];
            }
        }
    }
    
    update() {
        // we don't need the component anymore
        this.destroy();
    }
}
Sup.registerBehavior(ApplyTexture);
