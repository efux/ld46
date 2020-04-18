import * as Phaser from 'phaser';
import {Player} from "./entities/player";
import {Exit} from "./entities/exit";
import {Hubbie} from "./entities/hubbie";
import {Button} from "./ui/button";
import GameObject = Phaser.GameObjects.GameObject;
import Sprite = Phaser.Physics.Arcade.Sprite;
import Rectangle = Phaser.Geom.Rectangle;

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: true,
    visible: true,
    key: 'Game'
};

interface LightForRoom {
    room: number;
    x: number;
    y: number;
}

export class Level extends Phaser.Scene {

    private player: Player;
    private exit: Exit;
    private hubbie: Hubbie;

    private doors: any[];
    private lightForRooms: LightForRoom[] = [];
    private map: Phaser.Tilemaps.Tilemap;

    private isEscorting = false;

    private evacuateButton: Button;
    private pickUpButton: Button;

    private shownRooms = [1];

    constructor() {
        super(sceneConfig);
    }

    preload() {
        this.load.image('tileset-map', ['/assets/tileset.png', '/assets/tileset_n.png']);
        this.load.tilemapTiledJSON('map', '/assets/map.json');
        this.load.spritesheet('player', '/assets/player.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('exit', '/assets/exit.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('hubbie', '/assets/hubbie.png', {frameWidth: 64, frameHeight: 64});
        this.load.spritesheet('wheelchair', '/assets/wheelchair.png', {frameWidth: 64, frameHeight: 64});
    }

    create() {
        this.map = this.make.tilemap({key: 'map'});
        const tiles = this.map.addTilesetImage('tileset-map', 'tileset-map');
        this.map.createDynamicLayer('floor', tiles, 0, 0).setPipeline('Light2D');
        const abovePlayer = this.map.createDynamicLayer('abovePlayer', tiles, 0, 0).setPipeline('Light2D');
        const wallLayer = this.map.createStaticLayer('walls', tiles, 0, 0).setPipeline('Light2D');
        wallLayer.setCollisionByProperty({collides: true});

        this.lights.enable().setAmbientColor(0);

        abovePlayer.setDepth(10);
        wallLayer.setDepth(10);

        const spawnPoint: any = this.findObject(this.map, 'SpawnPoint');
        const hubbie: any = this.findObject(this.map, 'Hubbie');
        const exit: any = this.findObject(this.map, 'Exit');

        this.doors = this.findObjectyByType(this.map, 'door');

        this.player = new Player(this, spawnPoint.x, spawnPoint.y);
        this.exit = new Exit(this, exit.x, exit.y).setPipeline('Light2D');
        this.hubbie = new Hubbie(this, hubbie.x, hubbie.y);

        this.physics.add.collider(this.player, wallLayer);

        this.map.getObjectLayer('lights').objects.forEach(light => {
            const [roomProperty] = light.properties.filter(p => p.name === 'room');
            this.lightForRooms.push({room: roomProperty.value, x: light.x, y: light.y });
        });

        const camera = this.cameras.main;
        camera.startFollow(this.player);
        camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        this.pickUpButton = new Button(this, 'Escort', 100, 100, () => {
            this.isEscorting = true;
            this.hubbie.removeHubbieFromWheelchair();
        });
        this.turnOnLightsInRoom(0);

        this.evacuateButton = new Button(this, 'Evacuate', 100, 100, () => window.location.reload());
    }

    update(): void {
        if (this.isPlayerTouchingHubbie() && !this.isEscorting) {
            this.pickUpButton.show();
            this.pickUpButton.setCoordinates(this.player.x, this.player.y - 100);
        } else {
            this.pickUpButton.hide();
        }

        if (this.isPlayerTouchingExit() && this.isEscorting) {
            this.evacuateButton.show();
            this.evacuateButton.setCoordinates(this.player.x, this.player.y - 100);
        } else {
            this.evacuateButton.hide();
        }

        for (const door of this.doors) {
            if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), new Rectangle(door.x, door.y, door.width, door.height))) {
                this.doors = this.doors.filter(d => d !== door);
                const [roomProperty] = door.properties.filter(p => p.name === 'room');
                this.turnOnLightsInRoom(roomProperty.value);
                break;
            }
        }

        this.player.update();
    }

    private turnOnLightsInRoom(room: number) {
        console.log(`Turning on lights in room ${room}`);
        console.log(this.lightForRooms.filter(light => light.room === room));
        this.lightForRooms.filter(light => light.room === room).forEach(light => {
           this.lights.addLight(light.x, light.y, 400).setIntensity(1.0);
        });
    }

    private findObject(map: any, objName: string): GameObject {
        return map.findObject('objects', obj => obj.name === objName);
    }

    private findObjectyByType(map: any, typeName: string): GameObject[] {
        return map.getObjectLayer('objects').objects.filter(obj => obj.type === typeName);
    }

    private isPlayerTouchingHubbie(): boolean {
        return this.areGameObjectsOverlapping(this.player, this.hubbie);
    }

    private isPlayerTouchingExit(): boolean {
        return this.areGameObjectsOverlapping(this.player, this.exit);
    }

    private areGameObjectsOverlapping(obj1: Sprite, obj2: Sprite) {
        return Phaser.Geom.Intersects.RectangleToRectangle(obj1.getBounds(), obj2.getBounds());
    }
}