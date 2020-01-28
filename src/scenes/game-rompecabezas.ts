import { Card } from "../Card";
import { HorizontalContainer } from "../ui/horizontalContainer";
import { PieceConfig } from "../PieceConfig";
import { Create, Utils, } from "phaser";
import { UIUtils } from "./../utils/UIUtils";


const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  key: "Game",
  visible: false,
};


export class GameScene extends Phaser.Scene {

  public checkButton: Phaser.GameObjects.Image;
  public nextLevelButton: Phaser.GameObjects.Image;
  public homeButton: Phaser.GameObjects.Image;
  public helpButton: Phaser.GameObjects.Image;
  public flagHelpButton: Phaser.GameObjects.Image;

  public inGameMenuSpawnedButtonsHorzontalContainer: HorizontalContainer;
  public spawnedCards: Card[];
  public inGameMenuSpawnedButtons: Phaser.GameObjects.Image[];

  public canClickNextLevelButton: boolean;

  public loseCounter: number;

  public checkButtonDown: boolean;
  public topBanner: Phaser.GameObjects.Image;
  public topBannerText: Phaser.GameObjects.Text;

  public background: Phaser.GameObjects.Image;

  public gameplayContainer: Phaser.GameObjects.Container;
  public inGameMenuViewport: Phaser.GameObjects.Graphics;
  public soundButtonGeneric: Phaser.Sound.BaseSound;
  public soundValidationPositive: Phaser.Sound.BaseSound;
  public soundValidationNegative: Phaser.Sound.BaseSound;
  public nonGameplaySounds: Phaser.Sound.BaseSound[];
  public isNonGameplaySoundAble: boolean;

  public draggedObject: Card;
  public draggedObjectOriginalPosition: Phaser.Math.Vector2;
  public draggedObjectStopPosition: Phaser.Math.Vector2;
  public draggedObjectPositionToGo: Phaser.Math.Vector2;
  public motherCard: Phaser.GameObjects.Image;
  public slot: Phaser.Math.Vector2;
  public bIsInterpolationHappening: boolean;
  public dropZone: Phaser.GameObjects.Graphics;
  public cardOnDropZone: any;

  public interpolationSpeed: number;
  public interpolationTime: number;
  public interpolationCurrentTime: number;
  public isMouseOverUIButton: boolean;
  public markerDrawStarted: boolean;

  public lampMask: Phaser.GameObjects.Graphics;
  public snapshotText: string = "Snapshot";
  public snapshowId: number = 0;
  public cardsSpawned: number;
  public cardsToSpawn: number;

  constructor() {
    super(sceneConfig);
  }

  public preload() {
  }

  public create() {
    this.startGame();
  }

  public initializeArraysAndProperties() {
    this.cardsSpawned = 0;
    this.cardsToSpawn = 4;
    this.spawnedCards = new Array();
    this.checkButtonDown = false;
    this.markerDrawStarted = false;
    this.loseCounter = 0;
    this.isNonGameplaySoundAble = true;
    this.initializeSounds();
    this.draggedObjectOriginalPosition = new Phaser.Math.Vector2(0, 0);
    this.bIsInterpolationHappening = false;
    this.interpolationTime = 1;
    this.interpolationSpeed = 1;
    this.interpolationCurrentTime = 0;
    this.draggedObjectPositionToGo = new Phaser.Math.Vector2(0, 0);
    this.cardOnDropZone = null;
  }

  public playSound(sound: Phaser.Sound.BaseSound) {
    if (this.isNonGameplaySoundAble === true) {
      for (const nonGameplaySound of this.nonGameplaySounds) {
        if (nonGameplaySound.key === sound.key) {
          sound.play();
        }
      }
    }
  }

  public initializeSounds() {
    this.nonGameplaySounds = new Array(3);
    this.soundButtonGeneric = this.sound.add("button-generic");
    this.soundValidationPositive = this.sound.add("validation-positive");
    this.soundValidationNegative = this.sound.add("validation-negative");

    this.nonGameplaySounds[0] = this.soundButtonGeneric;
    this.nonGameplaySounds[1] = this.soundValidationPositive;
    this.nonGameplaySounds[2] = this.soundValidationNegative;
  }

  public startGame() {
    this.initializeArraysAndProperties();
    const circle = document.createElement("canvas");

    this.createBackgroundLayer();
    this.createGameplayLayer();
    this.createUI();
  }

  public createGameplayLayer() {
    const worldCenterX = this.game.scale.baseSize.width * 0.5;
    const worldCenterY = this.game.scale.baseSize.height * 0.5;

    this.gameplayContainer = this.add.container(0, 0);

    this.createMotherCard(worldCenterX, worldCenterY);
    this.spawnDropZone();
    this.spawnLevelCards();
    this.createUIButtons();
    this.createFXsLayer();

    window.addEventListener("resize", this.resizeGame.bind(this));
    UIUtils.resizeApp(this.game);
  }

  public resizeGame() {
    UIUtils.resizeApp(this.game);
  }

  public addNewSnapshotTexture(image: HTMLImageElement): string {
    const newTextureId = this.snapshotText + this.snapshowId.toString();
    this.textures.addImage(newTextureId, image);
    this.snapshowId++;
    return newTextureId;
  }

  public createFXsLayer() {
    // TO DO
    // const halfWidth = this.game.canvas.width * 0.5;
    // const halfHeight = this.game.canvas.height * 0.5;
    // //tslint:disable-next-line: max-line-length
    // const rect = this.add.sprite(halfWidth, halfHeight, "fondo");
    // rect.tint = 0x000000;
    // rect.alpha = 0.2;
    // rect.depth = 2;
    // // tslint:disable-next-line: max-line-length
    // // A mask is a Graphics object
    // this.lampMask = this.add.graphics();
    // this.lampMask.setInteractive();
    // this.lampMask.fillCircle(this.game.canvas.width / 2, this.game.canvas.height / 2, this.game.canvas.width / 10);
    // rect.mask = this.lampMask.createBitmapMask();
    // this.lampMask.depth = 2;
  }

  public createBackgroundLayer() {
    const halfWidth = this.game.canvas.width * 0.5;
    const halfHeight = this.game.canvas.height * 0.5;

    this.background = this.add.image(halfWidth, halfHeight, "fondo");
    this.background.setDisplaySize(this.game.canvas.width, this.game.canvas.height);
    this.background.depth = 0;
  }

  public createUI() {
    this.isMouseOverUIButton = false;

    this.topBanner = this.add.image(0, 0, "soporte");
    this.topBanner.width = this.game.scale.width;
    this.topBanner.setScale(1, this.game.scale.height / 800);

    this.topBanner.x = this.game.scale.width / 2;
    this.topBanner.y = this.topBanner.displayHeight / 2;
    this.topBanner.depth = 10;

    this.topBannerText = this.add.text(
      this.game.scale.baseSize.width / 2,
      0,
      "Encuentra la mitad correcta!", {
      color: "#FFFFFf",
      fontFamily: "Verdana",
      fontSize: this.game.scale.baseSize.width / 75,
    },
    );
    this.topBannerText.x -= this.topBannerText.displayWidth / 2;
    this.topBannerText.y = this.topBannerText.displayHeight;
    this.topBannerText.depth = 15;
  }

  public createUIButtons() {

    const uiScaleFactor = this.game.scale.baseSize.width / 1350;

    this.helpButton = this.add.image(this.game.scale.baseSize.width, 0, "busqueda", 0);
    this.helpButton.setScale(uiScaleFactor, uiScaleFactor);
    this.helpButton.x -= (this.helpButton.displayWidth / 2);
    this.helpButton.y += (this.helpButton.displayHeight / 2);
    this.helpButton.setInteractive({ useHandCursor: true })
      .on("pointerover", () => { this.isMouseOverUIButton = true; })
      .on("pointerout", () => { this.isMouseOverUIButton = false; });
    this.helpButton.depth = 11;

    this.homeButton = this.add.image(0, 0, "home", 0);
    this.homeButton.depth = 11;
    this.homeButton.setScale(uiScaleFactor, uiScaleFactor);
    this.homeButton.x += (this.homeButton.displayWidth / 2);
    this.homeButton.y += (this.homeButton.displayHeight / 2);
    this.homeButton.setInteractive({ useHandCursor: true })
      .on("pointerover", () => { this.isMouseOverUIButton = true; })
      .on("pointerout", () => { this.isMouseOverUIButton = false; })
      .on("pointerdown", () => {
        this.hideGameplay();
        this.showInGameMenu();
        this.playSound(this.soundButtonGeneric);
      },
      );

    // tslint:disable-next-line: max-line-length
    this.nextLevelButton = this.add.image(this.game.scale.baseSize.width, this.game.scale.baseSize.height, "next-up", 0);
    this.nextLevelButton.setScale(uiScaleFactor);
    this.nextLevelButton.x -= (this.nextLevelButton.displayWidth * 2.5 / 4);
    this.nextLevelButton.y -= (this.nextLevelButton.displayHeight / 2);
    this.nextLevelButton.y -= (this.nextLevelButton.displayHeight / 4);
    this.nextLevelButton.setInteractive({ useHandCursor: true })
      .on("pointerover", () => { this.isMouseOverUIButton = true; })
      .on("pointerout", () => {
        this.isMouseOverUIButton = false;
        this.nextLevelButton.setTexture("next-up");
      })
      .on("pointerdown", () => {
        this.playSound(this.soundButtonGeneric);
        if (this.nextLevelButton.alpha !== 0 && this.canClickNextLevelButton === true) {
          this.nextLevelButton.setTexture("next-press");
          // TO DO Remove Cards Animation
          // TO DO On Remove Cards End Call Next Exercise
        }
      })
      .on("pointerup",
        () => {
          this.nextLevelButton.setTexture("next-up");
        });

    this.nextLevelButton.alpha = 0;
    this.nextLevelButton.depth = 2;
    this.gameplayContainer.add(this.nextLevelButton);

    this.flagHelpButton = this.add.image(this.game.scale.baseSize.width, this.game.scale.baseSize.height, "flag-up", 0);
    this.flagHelpButton.setScale(uiScaleFactor);
    this.flagHelpButton.x -= (this.nextLevelButton.displayWidth * 2.5 / 4);
    this.flagHelpButton.y -= (this.nextLevelButton.displayHeight / 2);
    this.flagHelpButton.y -= (this.nextLevelButton.displayHeight / 4);
    this.flagHelpButton.depth = 2;
    this.flagHelpButton.alpha = 0;
    this.gameplayContainer.add(this.flagHelpButton);

    this.flagHelpButton.setInteractive({ useHandCursor: true })
      .on("pointerover", () => { this.isMouseOverUIButton = true; })
      .on("pointerout", () => { this.isMouseOverUIButton = false; })
      .on("pointerdown", () => {
        this.flagHelpButton.setTexture("flag-press");
        this.handleShowHelp();
        this.playSound(this.soundButtonGeneric);
      })
      .on("pointerup", () => {
        this.flagHelpButton.setTexture("flag-up");
      },
      );

    this.createCheckButton();
  }

  public toggleNonGameplaySound() {
    if (this.isNonGameplaySoundAble === true) {
      this.isNonGameplaySoundAble = false;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.nonGameplaySounds.length; i++) {
        this.nonGameplaySounds[i].stop();
      }
    } else {
      this.isNonGameplaySoundAble = true;
    }
  }

  public hideGameplay() {
    this.gameplayContainer.alpha = 0;
    this.homeButton.alpha = 0;
    this.helpButton.alpha = 0;
    this.topBanner.alpha = 0;
    this.topBannerText.alpha = 0;
    this.setCardsAlpha(0);
  }

  public setCardsAlpha(alphaValue: number) {
    for (const spawnedCard of this.spawnedCards) {
      spawnedCard.setAlpha(alphaValue);
    }
    this.motherCard.alpha = alphaValue;
  }

  public showInGameMenu() {

    this.inGameMenuViewport = this.add.graphics();
    this.inGameMenuViewport.fillRect(0, 0, this.game.scale.baseSize.width, this.game.scale.baseSize.height);
    this.inGameMenuViewport.fillStyle(0x000000, 0.4);

    // tslint:disable-next-line: max-line-length
    const inGameMenuButtonsHorizontalContainerPosition = new Phaser.Math.Vector2(this.game.scale.baseSize.width / 2, this.game.scale.baseSize.height / 2);

    this.inGameMenuSpawnedButtons = new Array();
    this.inGameMenuSpawnedButtons[0] = this.add.image(0, 0, "menu_play_up", 0);
    this.inGameMenuSpawnedButtons[0].on("pointerdown", () => {
      this.playSound(this.soundButtonGeneric);
      this.closeInGameMenu();
    });

    this.inGameMenuSpawnedButtons[1] = this.add.image(0, 0, "menu_return_up", 0);
    this.inGameMenuSpawnedButtons[1].on("pointerdown", () => {
      this.playSound(this.soundButtonGeneric);
      this.closeInGameMenu();
      this.resetGame(true);
    });

    this.inGameMenuSpawnedButtons[2] = this.add.image(0, 0, "menu-option-up", 0);

    this.setupInGameMenuSpawnedButtons(this.inGameMenuSpawnedButtons[0]);
    this.setupInGameMenuSpawnedButtons(this.inGameMenuSpawnedButtons[1]);
    this.setupInGameMenuSpawnedButtons(this.inGameMenuSpawnedButtons[2]);
    // tslint:disable-next-line: max-line-length
    this.inGameMenuSpawnedButtonsHorzontalContainer = new HorizontalContainer(inGameMenuButtonsHorizontalContainerPosition.x, inGameMenuButtonsHorizontalContainerPosition.y,
      this, this.inGameMenuSpawnedButtons);

    // tslint:disable-next-line: max-line-length
    // this.inGameMenuSpawnedButtons[3] = this.add.image(this.game.scale.baseSize.width / 2,  this.game.scale.baseSize.height / 2, "logo", 0);
    // this.inGameMenuSpawnedButtons[3].setScale(this.game.scale.baseSize.width / 2200);
    // this.inGameMenuSpawnedButtons[3].y += this.inGameMenuSpawnedButtons[3].displayHeight * 1.25;
  }

  public closeInGameMenu() {
    for (const spawnedButton of this.inGameMenuSpawnedButtons) {
      spawnedButton.destroy();
    }

    this.gameplayContainer.alpha = 1;
    this.homeButton.alpha = 1;
    this.helpButton.alpha = 1;
    this.inGameMenuViewport.destroy();
    this.isMouseOverUIButton = false;
    this.topBanner.alpha = 1;
    this.topBannerText.alpha = 1;

    this.setCardsAlpha(1);
  }

  public setupInGameMenuSpawnedButtons(inGameSpawnedButton: Phaser.GameObjects.Image) {
    const uiScaleFactor = this.game.scale.baseSize.width / 1350;
    inGameSpawnedButton.setScale(uiScaleFactor, uiScaleFactor);
    inGameSpawnedButton.x += (inGameSpawnedButton.displayWidth / 2);
    inGameSpawnedButton.y += (inGameSpawnedButton.displayHeight / 2);
    inGameSpawnedButton.setInteractive({ useHandCursor: true })
      .on("pointerover", () => { this.isMouseOverUIButton = true; })
      .on("pointerout", () => { this.isMouseOverUIButton = false; });
  }

  public handleShowHelp() {
    // TO DO Valid Card goes to Slot Tween
  }

  public resetGame(resetConfig: boolean) {
    this.cardsSpawned = 0;
    this.canClickNextLevelButton = true; // ?? Vi esto y dije what? No suena bien :P
    this.flagHelpButton.alpha = 0;
    this.loseCounter = 0;
    this.cardOnDropZone = null;
    this.markerDrawStarted = false;
    this.nextLevelButton.alpha = 0;
    this.destroyCards();
    this.createMotherCard(this.game.scale.baseSize.width / 2, this.game.scale.baseSize.height / 2);
    this.spawnLevelCards();
    this.updateButtonState(false);
  }

  public createCheckButton() {
    this.checkButton = this.add.image(this.game.scale.baseSize.width / 2, this.game.scale.baseSize.height, "checklock-up", 0);
    this.checkButton.setScale(this.game.scale.baseSize.width / 1700);
    this.checkButton.y -= (this.checkButton.displayHeight / 2);
    this.checkButton.setInteractive({ useHandCursor: true })
      .on("pointerover", () => { this.isMouseOverUIButton = true; })
      .on("pointerout", () => { this.isMouseOverUIButton = false; })
      .on("pointerdown", () => {
        if (this.cardOnDropZone != null) {
          this.checkButtonDown = true;
          this.updateButtonState(true);
          this.onPointerClickCheck();
        }
      })
      .on("pointerup", () => {
        if (this.checkButtonDown === true) {
          this.checkButtonDown = false;
          this.updateButtonState(false);
          if (this.canWinTheGame()) {
            this.flagHelpButton.alpha = 0;
          }
        }
      });
    this.checkButton.alpha = 1;
    this.gameplayContainer.add(this.checkButton);
    this.updateButtonState(false);
  }

  public toggleFullScreen() {
    if (this.scale.isFullscreen) {
      this.scale.stopFullscreen();
    } else {
      this.scale.startFullscreen();
    }
  }

  public updateButtonState(clicked: boolean) {
    if (this.cardOnDropZone == null) {
      this.checkButton.setTexture(clicked ? "checklock-press" : "checklock-up");
    } else {
      if (this.canWinTheGame()) {
        this.checkButton.setTexture(clicked ? "checkright-press" : "checkright-up");
      } else {
        this.checkButton.setTexture(clicked ? "checkwrong-press" : "checkwrong-up");
      }
    }
  }

  public canWinTheGame(): boolean {
    // Validation Check?
    return true;
  }

  public onCheckFail() {
    // Reset Animation
    this.updateButtonState(false);
  }

  public onPointerClickCheck() {
    if (!this.canWinTheGame()) {
      // On Check Fail maybe should contain the play sound and the delay to animate
      this.soundValidationNegative.play();
      this.time.delayedCall(800, () => this.onCheckFail());
      return;
    }

    this.soundValidationPositive.play();

    // Multiple objects animation simultaneously. Kept here as reference

    // this.letterTraceValidated = true;

    // const letters = new Array();
    // letters[letters.length] = this.startLetter;
    // letters[letters.length] = this.startLetterPainted;

    // this.lettersValidatedTween = this.tweens.add({
    //   targets: letters,
    //   // tslint:disable-next-line: object-literal-sort-keys
    //   props: {
    //     scaleX: { value: 1.2, ease: "Power2" },
    //     scaleY: { value: 1.2, ease: "Power2" },
    //   },
    //   duration: 500,
    //   repeat: 0,
    //   loop: 0,
    //   onComplete: this.onCompleteLettersTween.bind(this),
    // });
  }

  public createMotherCard(worldCenterX: number, worldCenterY: number) {
    this.motherCard = this.add.image(worldCenterX, worldCenterY, "abeja-amarilla-hembra", 0);
    this.motherCard.setScale(this.game.scale.baseSize.width / 1920 / 2.5);
    this.motherCard.y -= this.motherCard.displayHeight * 2;
    this.motherCard.depth = 1;
    
    this.slot = new Phaser.Math.Vector2(this.motherCard.x, this.motherCard.y + this.motherCard.displayHeight);
  }

  public spawnDropZone() {
    const motherCardHeight = this.motherCard.displayHeight;
    const dropZoneYPosition = this.motherCard.y + (motherCardHeight * 0.5);
    const baseSizeWidth = this.game.scale.baseSize.width;
    this.dropZone = this.add.graphics();
    this.dropZone.fillRect(0, dropZoneYPosition,
      baseSizeWidth, motherCardHeight * 2);
    this.dropZone.fillStyle(0xFFFFFF, 0.2);
  }

  public getDropZoneYPosition(): number {
    return this.dropZone.commandBuffer[2] + (this.getDropZoneHeight() * 0.5);
  }

  public getDropZoneHeight(): number {
    return this.dropZone.commandBuffer[4];
  }
  public isInsideDropZone(verticalPositionToCheck: number): boolean {
    const halfSize = this.getDropZoneHeight() * 0.5;
    const yPosition = this.getDropZoneYPosition();
    if (verticalPositionToCheck < yPosition + halfSize
      && verticalPositionToCheck > yPosition - halfSize) {
      return true;
    }
    return false;
  }

  public destroyCards() {
    for (const spawnedCard of this.spawnedCards) {
      spawnedCard.destroy();
    }
    if (this.motherCard != null) {
      this.motherCard.destroy();
    }
  }

  public getCardsToSpawn(): Card[] {
    let Cards: Array<Card> = [
      new Card("abeja-amarilla-hembra", true),
      new Card("carta-macho", true),
      new Card("carta-macho", true),
      new Card("carta-macho", true)];
    return Cards;
  }

  public spawnLevelCards() {
    const shouldSpawnNewCard = this.cardsSpawned < this.cardsToSpawn;
    if (shouldSpawnNewCard === false) {
      this.onCardsSpawned();
      return;
    }

    const halfObjects = this.cardsToSpawn / 2;
    const card = new Card("test", false);
    this.spawnedCards[this.spawnedCards.length] = card;
    card.spawnCard(0, 0, PieceConfig.constHard1Down, "abeja-small", this, shouldSpawnNewCard);

    let yPosition = this.game.canvas.height / 2;
    yPosition += card.piece.displayHeight * 1.5;

    let xPosition = this.game.canvas.width / 2;
    xPosition -= card.piece.displayWidth * halfObjects;
    xPosition += card.piece.displayWidth * this.cardsSpawned + (card.piece.displayWidth / 2);
    this.cardsSpawned++;

    card.setPosition(new Phaser.Math.Vector2(xPosition, yPosition));
  }

  public onCardsSpawned()
  {
    // const camera = this.cameras.cameras[0];
    // camera.flash(500, 143, 0, 255);
    for(let i:number = 0; i < this.spawnedCards.length; i++)
    {
    //  this.spawnedCards[i].onCompleteStartAnimation();
    }
  }

  public update(time: number, delta: number) {
    super.update(delta, time);

    this.updateInterpolation(delta);
    this.updateGame(time, delta);
  }

  public updateInterpolation(delta: number) {
    if (this.bIsInterpolationHappening === false) {
      return;
    }

    if (this.interpolationCurrentTime >= this.interpolationTime) {
      return;
    }

    this.interpolationCurrentTime += delta / 1000;
    this.interpolationCurrentTime = Phaser.Math.Clamp(this.interpolationCurrentTime, 0, this.interpolationCurrentTime);

    const xPosition = Phaser.Math.Linear(this.draggedObjectStopPosition.x, this.draggedObjectPositionToGo.x,
      this.interpolationCurrentTime / this.interpolationTime);
    const yPosition = Phaser.Math.Linear(this.draggedObjectStopPosition.y, this.draggedObjectPositionToGo.y,
      this.interpolationCurrentTime / this.interpolationTime);

    this.draggedObject.setPosition(new Phaser.Math.Vector2(xPosition, yPosition));
    if (this.interpolationCurrentTime >= this.interpolationTime) {
      // tslint:disable-next-line: max-line-length
      this.draggedObject.setPosition(new Phaser.Math.Vector2(this.draggedObjectPositionToGo.x, this.draggedObjectPositionToGo.y));
      this.bIsInterpolationHappening = false;
      this.updateButtonState(false);
    }
  }

  public isMouseOverAnyUIButton(): boolean {
    return this.isMouseOverUIButton;
  }

  public updateGame(time: number, delta: number) {
    if (this.game.input.activePointer.isDown && this.markerDrawStarted) {
      this.dragObject(time, delta);
    }
  }

  public onPlayerLost() {
    this.markerDrawStarted = false;
    this.loseCounter++;
    if (this.loseCounter >= 2) {
      this.flagHelpButton.alpha = 1;
    }
  }

  public dragObject(time: number, delta: number) {
    if (this.bIsInterpolationHappening === true) {
      return;
    }

    // Old Behaviour
    // this.draggedObject.x = this.game.input.activePointer.x;
    // this.draggedObject.y = this.game.input.activePointer.y;

    // Este es el cambio necesario para soportar las cartas como las agrego fabi con mascara
    // tslint:disable-next-line: max-line-length
    this.draggedObject.setPosition(new Phaser.Math.Vector2(this.game.input.activePointer.x, this.game.input.activePointer.y));
  }
}
