import * as Phaser from 'phaser';
import {Level} from './level';
import GameConfig = Phaser.Types.Core.GameConfig;

const gameConfig: GameConfig = {
    title: 'LD46',

    type: Phaser.AUTO,

    scale: {
        width: window.innerWidth,
        height: window.innerHeight,

    },

    render: {
        maxLights: 50,
    },

    scene: Level,

    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: 0}
        }
    },

    parent: 'game',
    backgroundColor: '#000000',

};

export const game = new Phaser.Game(gameConfig);
