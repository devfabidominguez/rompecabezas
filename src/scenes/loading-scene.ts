
const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  // tslint:disable-next-line: object-literal-sort-keys
  key: "LoadingScene",
};

/*
The initial scene that loads all necessary assets to the game and displays a loading bar. 
 La escena inicial que carga todos los recursos necesarios para el juego y muestra una barra de carga. */
 
export class LoadingScene extends Phaser.Scene {

  public progressBarContainer: Phaser.GameObjects.Image;
  public progressBar: Phaser.GameObjects.Image;
  public originalScale: number;
  public background: Phaser.GameObjects.Image;

  constructor() {
    super(sceneConfig);
  }

  public preload() {
    const halfWidth = this.game.scale.baseSize.width * 0.5;
    const halfHeight = this.game.scale.baseSize.height * 0.5;

    this.background = this.add.image(this.game.scale.baseSize.width / 2, this.game.scale.baseSize.height / 2, "fondo");
    this.background.width = window.innerWidth;
    this.background.height = window.innerHeight;
    this.background.setScale(window.innerWidth / window.devicePixelRatio / this.game.scale.baseSize.width,
      window.innerHeight / window.devicePixelRatio / this.game.scale.baseSize.height);

    this.originalScale = this.game.scale.baseSize.width / 1920;

    // tslint:disable-next-line: max-line-length
    this.progressBarContainer = this.add.image(this.game.scale.baseSize.width * 0.5, this.game.scale.baseSize.height * 0.5, "base_carga", 0);
    this.progressBarContainer.setScale(this.originalScale);
    // tslint:disable-next-line: max-line-length
    this.progressBar = this.add.image(this.game.scale.baseSize.width * 0.5, this.game.scale.baseSize.height * 0.5, "barra_carga", 0);
    this.progressBar.setOrigin(0, 0.5);
    this.progressBar.setScale(this.originalScale);

    this.progressBar.y -= this.progressBarContainer.displayHeight / 20;
    const loadingText = this.add.text(halfWidth, halfHeight, "Cargando...").setFontSize(24);
    loadingText.setFontSize(35);
    loadingText.setScale(this.originalScale);
    loadingText.x -= loadingText.displayWidth * 3 / 4;
    loadingText.y -= loadingText.displayHeight / 2;

    const percentText = this.add.text(halfWidth, halfHeight, "0%").setFontSize(24);
    percentText.setFontSize(35);
    percentText.setScale(this.originalScale);
    percentText.y -= percentText.displayHeight / 2;
    percentText.x += percentText.displayWidth * 1.5;

    this.load.on("progress", (value: number) => {
      this.progressBar.scaleX = value * this.originalScale;
      // tslint:disable-next-line: max-line-length
      this.progressBar.x = halfWidth - this.progressBarContainer.displayWidth / 2.035;
      const percent = value * 100;
      percentText.setText(`${percent}%`);
    });

    this.load.on("complete", () => {
      loadingText.destroy();
      percentText.destroy();
      this.progressBar.destroy();
      this.progressBarContainer.destroy();
      this.scene.start("Game");
      this.scene.stop();
      });

    this.loadAssets();
  }
  /**
   * All assets that need to be loaded by the game (sprites, images, animations, tiles, music, etc)
   * should be added to this method. Once loaded in, the loader will keep track of them, indepedent of which scene
   * is currently active, so they can be accessed anywhere.
   */
  private loadAssets() {
    this.load.image("next-up", "assets/Next-Up.png");
    this.load.image("next-press", "assets/Next-Press.png");

    this.load.image("check-press", "assets/Check-Press.png");
    this.load.image("check-up", "assets/Check-Up.png");
    this.load.image("checklock-press", "assets/CheckLock-Press.png");
    this.load.image("checklock-up", "assets/CheckLock-Up.png");
    this.load.image("checkright-press", "assets/CheckRight-Press.png");
    this.load.image("checkright-up", "assets/CheckRight-Up.png");
    this.load.image("checkwrong-press", "assets/CheckWrong-Press.png");
    this.load.image("checkwrong-up", "assets/CheckWrong-Up.png");

    this.load.image("busqueda", "assets/Help-Up.png");
    this.load.image("home", "assets/Home-Up.png");
    this.load.image("soporte", "assets/Soporte_16x9.png");

    this.load.image("flag-up", "assets/Flag-Up.png");
    this.load.image("flag-press", "assets/Flag-Press.png");

    this.load.image("menu_play_press", "assets/Menu_Play-Press.png");
    this.load.image("menu_play_up", "assets/Menu_Play-Up.png");

    this.load.image("menu_return_press", "assets/Menu_Return-Press.png");
    this.load.image("menu_return_up", "assets/Menu_Return-Up.png");

    this.load.image("menu-option-press", "assets/Menu_Option-Press.png");
    this.load.image("menu-option-up", "assets/Menu_Option-Up.png");

    this.load.image("carta-hembra", "assets/Carta-01-A.png");
    this.load.image("carta-macho", "assets/Carta-01-B.png");

    this.load.audio("button-generic", "assets/sounds/Button_generic.wav");
    this.load.audio("validation-negative", "assets/sounds/Validation_Negative.wav");
    this.load.audio("validation-positive", "assets/sounds/Validation_Positive.wav");
    this.load.audio("level-finished", "assets/sounds/Level_Finished.wav");

    this.load.image("Carta_Hard1_Down", "assets/Carta_Hard1_Down.png");
    this.load.image("Carta_Hard1_Up", "assets/Carta_Hard1_Up.png");

    this.load.image("Carta_Hard2_Down", "assets/Carta_Hard2_Down.png");
    this.load.image("Carta_Hard2_Up", "assets/Carta_Hard2_Up.png");

    this.load.image("Carta_Hard3_Down", "assets/Carta_Hard3_Down.png");
    this.load.image("Carta_Hard3_Up", "assets/Carta_Hard3_Up.png");

    this.load.image("Carta_Mid1_Down", "assets/Carta_Mid1_Down.png");
    this.load.image("Carta_Mid1_Up", "assets/Carta_Mid1_Up.png");

    this.load.image("Carta_Mid2_Down", "assets/Carta_Mid2_Down.png");
    this.load.image("Carta-Mid2-Up", "assets/Carta-Mid2-Up.png");

    this.load.image("Carta_Mid3_Down", "assets/Carta_Mid3_Down.png");
    this.load.image("Carta_Mid3_Up", "assets/Carta_Mid3_Up.png");

    this.load.image("Carta_Plana_Down", "assets/Carta_Plana_Down.png");
    this.load.image("Carta_Plana_Up", "assets/Carta_Plana_Up.png");
  }
}