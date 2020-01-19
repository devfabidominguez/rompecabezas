import Scenes from './scenes';

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Wumbox - Rompecabezas',

  type: Phaser.CANVAS,

  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH,
    height: window.outerHeight * window.devicePixelRatio,
    mode: Phaser.Scale.ScaleModes.RESIZE,
    resolution: window.devicePixelRatio,
    width: window.outerWidth * window.devicePixelRatio,
  },
  
  scene: Scenes,

  physics: {
    arcade: {
      debug: true,
    },
    default: 'arcade',
  },

  parent: 'game',
  backgroundColor: '#000000',
};

export const game = new Phaser.Game(gameConfig);