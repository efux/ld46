import * as Phaser from 'phaser';
import {Level} from './level';

const gameConfig: Phaser.Types.Core.GameConfig = {
    title: 'LD46',

    type: Phaser.AUTO,

    scale: {
        width: window.innerWidth,
        height: window.innerHeight,

    },

    scene: Level,

    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: 0}
        }
    },

    parent: 'game',
    backgroundColor: '#FFdddd',

};

export const game = new Phaser.Game(gameConfig);
