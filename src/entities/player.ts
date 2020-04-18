import Scene = Phaser.Scene;
import Body = Phaser.Physics.Arcade.Body;
import Sprite = Phaser.Physics.Arcade.Sprite;

export class Player extends Sprite {

    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private speed = 175;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'player');
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setSize(32, 32);
        this.cursors = this.scene.input.keyboard.createCursorKeys();
    }

    update(): void {
        this.getBody().setVelocity(0);

        if (this.cursors.left.isDown) {
            this.getBody().setVelocityX(-100);
        } else if (this.cursors.right.isDown) {
            this.getBody().setVelocityX(100);
        }

        if (this.cursors.up.isDown) {
            this.getBody().setVelocityY(-100);
        } else if (this.cursors.down.isDown) {
            this.getBody().setVelocityY(100);
        }

        this.getBody().velocity.normalize().scale(this.speed);
    }

    private getBody(): Body {
        return this.body as Body;
    }

}