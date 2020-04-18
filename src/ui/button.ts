import Scene = Phaser.Scene;
import Rectangle = Phaser.GameObjects.Rectangle;
import Text = Phaser.GameObjects.Text;

export class Button {

    private visible = false;

    private button: Rectangle;
    private text: Text;

    private mousePointer;

    constructor(private scene: Scene, private title: string, private x: number, private y: number, private clickedCallback?: Function, private callbackContext?) {
        this.mousePointer = this.scene.input.mousePointer;

        this.button = new Rectangle(this.scene, this.x, this.y, 300, 50, 0xff0000, 0.5);
        this.text = new Text(this.scene, this.x, this.y - 5, this.title, null);

        this.button.visible = false;
        this.button.setInteractive();
        this.button.on('pointerup', this.clicked, this);
        this.button.on('pointerover', this.hover, this);
        this.button.on('pointerout', this.hoverOut, this);
        this.text.visible = false;

        this.scene.add.existing(this.button);
        this.scene.add.existing(this.text);
    }

    setCoordinates(x: number, y: number) {
        this.button.setPosition(x, y);
        this.text.setPosition(x, y - 5);
    }

    show() {
        if (!this.visible) {
            this.button.visible = true;
            this.text.visible = true;
            this.visible = true;
        }
    }

    hide(): void {
        this.button.visible = false;
        this.text.visible = false;
        this.visible = false;
    }

    private hover() {
        this.button.setFillStyle(0xBB0000, 0.5);
    }

    private hoverOut() {
        this.button.setFillStyle(0xFF0000, 0.5);
    }


    private clicked() {
        if (!!this.clickedCallback) {
            this.clickedCallback();
        }
    }
}