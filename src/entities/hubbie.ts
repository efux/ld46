import Scene = Phaser.Scene;
import Sprite = Phaser.Physics.Arcade.Sprite;

export class Hubbie extends Sprite {

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'hubbie');
        this.scene.add.existing(this);
        this.setupAnimations();
    }

    removeHubbieFromWheelchair(): void {
        this.anims.load('empty-wheelchair');
        this.scene.anims.play('empty-wheelchair', this);
    }

    private setupAnimations() {
        this.scene.anims.create({
            key: 'hubbie-waiting',
            frames: this.scene.anims.generateFrameNumbers('hubbie', {}),
            frameRate: 3,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'empty-wheelchair',
            frames: this.scene.anims.generateFrameNumbers('wheelchair', {}),
            frameRate: 0,
            repeat: -1
        });
        this.anims.load('hubbie-waiting');
        this.scene.anims.play('hubbie-waiting', this);
    }

}