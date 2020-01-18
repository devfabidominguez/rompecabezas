import Scenes from "./scenes";
import { UIUtils } from "./utils/UIUtils";

let testGame: Phaser.Game;

window.onload = () => {
    window.focus();
    testGame = new Phaser.Game({
        parent: "phaser-game",
        render: { pixelArt: false, transparent: true, antialias: true },
        scale : {
            autoCenter: Phaser.Scale.CENTER_BOTH,
            height: 1080,
            mode: Phaser.Scale.FIT,
            width: 1920,
        },
        scene: Scenes,
        type: Phaser.WEBGL,
        });
};