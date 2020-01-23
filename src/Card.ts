import { GameScene } from "./scenes/game-rompecabezas";

export class Card {
    public cardName: string;
    public bIsTheSolution: boolean;
    public piece: Phaser.GameObjects.Image;
    public animal: Phaser.GameObjects.Image;
    constructor(cardName: string, bIsTheSolution: boolean) {
        this.cardName = cardName;
        this.bIsTheSolution = bIsTheSolution;
    }

    public spawnCard(x: number, y: number, pieceTexture: string, animalTexture: string, scene: Phaser.Scene) {
        this.piece = scene.add.image(x, y, pieceTexture);
        this.animal = scene.add.image(x, y, animalTexture);
        this.piece.setInteractive();
        this.piece.setScale(0.4);
        this.animal.setScale(0.4);
        this.piece.y += this.animal.displayHeight / 4;

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
    }

    public setAlpha(value: number)
    {
        this.piece.alpha = value;
        this.animal.alpha = value;
    }

    public destroy()
    {
        this.piece.destroy();
        this.animal.destroy();
    }
}