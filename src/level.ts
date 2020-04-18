import * as Phaser from 'phaser';
import {Player} from "./entities/player";
import {Exit} from "./entities/exit";
import {Hubbie} from "./entities/hubbie";
import GameObject = Phaser.GameObjects.GameObject;
import Sprite = Phaser.Physics.Arcade.Sprite;

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: true,
    visible: true,
    key: 'Game'
};

export class Level extends Phaser.Scene {

    private player: Player;
    private exit: Exit;
    private hubbie: Hubbie;

    private pickupAllowed = false;

    constructor() {
        super(sceneConfig);
    }

    preload() {
        this.load.image('tileset-map', '/assets/tileset.png');
        this.load.tilemapTiledJSON('map', '/assets/map.json');
        this.load.spritesheet('player', '/assets/player.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('exit', '/assets/exit.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('hubbie', '/assets/hubbie.png', {frameWidth: 64, frameHeight: 64});
    }

    create() {
        const map = this.make.tilemap({key: 'map'});
        const tiles = map.addTilesetImage('tileset-map', 'tileset-map');
        const floorLayer = map.createStaticLayer('floor', tiles, 0, 0);
        const abovePlayer = map.createStaticLayer('abovePlayer', tiles, 0, 0);
        const wallLayer = map.createStaticLayer('walls', tiles, 0, 0);
        wallLayer.setCollisionByProperty({collides: true});

        abovePlayer.setDepth(10);

        const spawnPoint: any = this.findObject(map, 'SpawnPoint');
        const hubbie: any = this.findObject(map, 'Hubbie');
        const exit: any = this.findObject(map, 'Exit');

        this.player = new Player(this, spawnPoint.x, spawnPoint.y);
        this.exit = new Exit(this, exit.x, exit.y);
        this.hubbie = new Hubbie(this, hubbie.x, hubbie.y);

        this.physics.add.collider(this.player, wallLayer);

        const camera = this.cameras.main;
        camera.startFollow(this.player);
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    }

    update(): void {
        this.pickupAllowed = this.isPlayerTouchingHubbie();
        this.player.update();
    }

    private findObject(map: any, objName: string): GameObject {
        return map.findObject('objects', obj => obj.name === objName);
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