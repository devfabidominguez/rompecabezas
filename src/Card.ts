import { GameScene } from "./scenes/game-rompecabezas";
import { Renderer, CANVAS } from "phaser";
import scenes from "../Build/14-1-2020/src/scenes";
import { Piece } from "./Piece";

export class Card {
    public cardName: string;
    public bIsTheSolution: boolean;
    public piece: Phaser.GameObjects.Image;
    public animal: Phaser.GameObjects.Image;
    public scene: Phaser.Scene;
    public spawnNext: boolean;
    public createPhoto: boolean;

    constructor(cardName: string, bIsTheSolution: boolean) {
        this.cardName = cardName;
        this.bIsTheSolution = bIsTheSolution;
        this.createPhoto = true;
    }

    // tslint:disable-next-line: max-line-length
    public spawnCard(x: number, y: number, pieceTexture: string, animalTexture: string, scene: Phaser.Scene, spawnNext: boolean) {
        this.piece = scene.add.image(x, y, pieceTexture);
        this.animal = scene.add.image(x, y, animalTexture);
        this.animal.depth = 1;
        this.piece.setInteractive();
        this.piece.y += this.animal.displayHeight / 4;
        this.piece.depth = 1;
        this.scene = scene;
        this.spawnNext = spawnNext;
        this.animal.mask = this.piece.createBitmapMask();
        const gameScene = scene as GameScene;
        this.piece.on("pointerdown", () => {
            if (gameScene.bIsInterpolationHappening === true) {
                return;
            }
            if (gameScene.cardOnDropZone !== null && gameScene.cardOnDropZone !== this.piece) {
                return;
            }
            gameScene.markerDrawStarted = true;
            gameScene.draggedObject = this;
            if (gameScene.cardOnDropZone !== this.piece) {
                gameScene.draggedObjectOriginalPosition.x = this.piece.x;
                gameScene.draggedObjectOriginalPosition.y = this.piece.y;
            }
        });

        this.piece.on("pointerup", () => {
            if (!gameScene.markerDrawStarted) {
                return;
            }

            gameScene.bIsInterpolationHappening = true;
            gameScene.interpolationCurrentTime = 0;
            gameScene.markerDrawStarted = false;
            gameScene.draggedObjectStopPosition = new Phaser.Math.Vector2(
                gameScene.game.input.activePointer.x,
                gameScene.game.input.activePointer.y);

            // tslint:disable-next-line: max-line-length
            if (gameScene.isInsideDropZone(gameScene.game.input.activePointer.y)) {
                if (gameScene.cardOnDropZone === this.piece) {
                    const distanceX = Math.abs(this.piece.x - gameScene.slot.x);
                    const distanceY = Math.abs(this.piece.y - gameScene.slot.y);
                    if (distanceX < this.piece.displayWidth / 2 && distanceY < this.piece.displayHeight / 2) {
                        gameScene.draggedObjectPositionToGo = gameScene.draggedObjectOriginalPosition;
                        gameScene.cardOnDropZone = null;
                        return;
                    }
                } else {
                    gameScene.draggedObjectPositionToGo = gameScene.slot;
                    gameScene.cardOnDropZone = this.piece;
                }
            } else {
                gameScene.draggedObjectPositionToGo = gameScene.draggedObjectOriginalPosition;
                gameScene.cardOnDropZone = null;
            }
        });
    }

    public setPosition(vec: Phaser.Math.Vector2) {
        this.animal.setPosition(vec.x, vec.y);
        this.animal.y -= this.animal.displayHeight / 4;

        this.piece.x = this.animal.x;
        this.piece.y = this.animal.y + (this.animal.displayHeight / 4);

        if (this.createPhoto === true) {
            this.createPhoto = false;
            // const gameScene = this.scene as GameScene;
            // gameScene.spawnLevelCards();
            const gameScene = this.scene as GameScene;
            // tslint:disable-next-line: max-line-length
            this.scene.game.renderer.snapshotArea(this.piece.x - (this.piece.width * 0.5), this.piece.y - (this.piece.height * 0.5), this.piece.width, this.piece.height, this.onPhotoTaken.bind(this));
        }
    }

    public onPhotoTaken(image: HTMLImageElement) {
        const gameScene = this.scene as GameScene;
        const textureName = gameScene.addNewSnapshotTexture(image);
        this.animal.clearMask();
        this.animal.alpha = 0;
        this.animal.destroy();
        this.piece.setTexture(textureName);
        gameScene.spawnLevelCards();
    }

    public startAnimation()
    {
        this.scene.tweens.add({
            targets: this.piece,
            // tslint:disable-next-line: object-literal-sort-keys
            props: {
              x: { value: this.piece.x + this.scene.game.canvas.width, ease: "Power2" },
            },
            duration: 500,
            repeat: 0,
            loop: 0,
            onComplete: this.onCompleteStartAnimation.bind(this),
          });
    }

    public onCompleteStartAnimation()
    {
        this.scene.tweens.add({
            targets: this.piece,
            // tslint:disable-next-line: object-literal-sort-keys
            props: {
              x: { value: this.piece.x - this.scene.game.canvas.width * 0.5, ease: "Power2" },
            },
            duration: 500,
            repeat: 0,
            loop: 0,
          });
    }

    public setAlpha(value: number) {
        this.piece.alpha = value;
    }

    public destroy() {
        this.piece.destroy();
    }
}