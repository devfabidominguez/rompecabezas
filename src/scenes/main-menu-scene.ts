import { Button, MenuButton } from "../ui/menu-button";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  // tslint:disable-next-line: object-literal-sort-keys
  key: "MainMenu",
};

/**
 * The initial scene that starts, shows the splash screens, and loads the necessary assets.
 */
export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
    // tslint:disable-next-line: no-console
    console.log("start Main Menu");
  }

  public create() {

    // tslint:disable-next-line: no-console
    console.log("start Main Menu");
    const windowInnerWidth = window.innerWidth * window.devicePixelRatio;
    const windowInnerHeight = window.innerHeight * window.devicePixelRatio;
    const worldCenterX = windowInnerWidth / 2;
    const worldCenterY = windowInnerHeight / 2;
    const button = new MenuButton(this, worldCenterX, worldCenterY, "Rompecabezas", () => {
      this.scene.start("Game-Rompecabezas");
      this.scene.stop("MainMenu");
    });
    button.y -= button.height / 2;
    button.x -= button.width / 2;
    button.setLabelPos(button.x, button.y);

    const button2 = new MenuButton(this, worldCenterX, worldCenterY, "Editor", () => {
      this.scene.start("Editor");
      this.scene.stop("MainMenu");
    });

    button2.y += button.height / 2;
    button2.x -= button.width / 2;
    button2.setLabelPos(button2.x, button2.y);
  }
}
