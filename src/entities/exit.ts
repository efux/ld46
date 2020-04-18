import Scene = Phaser.Scene;
import Sprite = Phaser.Physics.Arcade.Sprite;

export class Exit extends Sprite {

    constructor(public scene: Scene, x: number, y: number) {
        super(scene, x, y, 'exit');
        this.scene.add.existing(this);
        this.setupAnimations();
    }

    private setupAnimations() {
        this.scene.anims.create({
            key: 'exit-bumping',
            frames: this.scene.anims.generateFrameNumbers('exit', {}),
            frameRate: 5,
            repeat: -1
        })
        this.anims.load('exit-bumping');
        this.scene.anims.play('exit-bumping', this);
    }

}