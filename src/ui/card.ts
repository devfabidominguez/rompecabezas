export class Card {

    public static constHard1Down: string = "Carta_Hard1_Down";
    public static constHard1Up: string = "Carta_Hard1_Up";
    public static constHard2Down: string = "Carta_Hard2_Down";
    public static constHard2Up: string = "Carta_Hard2_Up";
    public static constHard3Down: string = "Carta_Hard3_Down";
    public static constHard3Up: string = "Carta_Hard3_Up";
    public static constMid1Down: string = "Carta_Mid1_Down";
    public static constMid1Up: string = "Carta_Mid1_Up";
    public static constMid2Down: string = "Carta_Mid2_Down";
    public static constMid2Up: string = "Carta-Mid2-Up";
    public static constMid3Down: string = "Carta_Mid3_Down";
    public static constMid3Up: string = "Carta_Mid3_Up";
    public static constPlanaDown: string = "Carta_Plana_Down";
    public static constPlanaUp: string = "Carta_Plana_Up";

    public image: Phaser.GameObjects.Image;
    public originSlot: Phaser.Math.Vector2;

    // tslint:disable-next-line: no-empty
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string){
        this.image = scene.add.image(x, y, texture);
    }
}
