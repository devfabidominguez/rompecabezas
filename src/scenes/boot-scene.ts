import { MainMenuScene } from "../scenes/main-menu-scene";
import { UIUtils } from "./../utils/UIUtils"

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  // tslint:disable-next-line: object-literal-sort-keys
  key: "Boot",
};

/*
The initial scene that loads all necessary assets to the game and displays a loading bar. 
 La escena inicial que carga todos los recursos necesarios para el juego y muestra una barra de carga. */
export class BootScene extends Phaser.Scene {

  public progressBarContainer: Phaser.GameObjects.Image;
  public progressBar: Phaser.GameObjects.Image;
  
  constructor() {
    super(sceneConfig);
  }

  public preload() {
    this.load.on("complete", () => {
      this.scene.start("LoadingScene");
    });

    this.load.image("barra_carga", "assets/Barra_carga.png");
    this.load.image("base_carga", "assets/Base_carga.png");
    this.load.image("fondo", ["assets/Fondo_16x9.png", "assets/Fondo_16x9.png"]);
  }
}
