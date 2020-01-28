export class Piece
{
    public image: Phaser.GameObjects.Image;
    public originSlot: Phaser.Math.Vector2;

    // tslint:disable-next-line: no-empty
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string){
        this.image = scene.add.image(x, y, texture);
    }
}
