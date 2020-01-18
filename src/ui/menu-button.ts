const padding = 10;
const minimumWidth = 200;
const minimumHeight = 50;
const minimumWidth2 = 50;
const minimumHeight2 = 30;


export class MenuButton extends Phaser.GameObjects.Rectangle {
  private label: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number, text: string, onClick?: () => void) {
    super(scene, x, y);
    scene.add.existing(this);
    this.setOrigin(0, 0);

    this.label = scene.add.text(x + padding, y + padding, text).setFontSize(18).setAlign("center");

    const labelWidth = this.label.width + padding;
    const labelHeight = this.label.height + padding;

    this.width = labelWidth >= minimumWidth ? labelWidth : minimumWidth;
    this.height = labelHeight >= minimumHeight ? labelHeight : minimumHeight;

    this.setInteractive({ useHandCursor: true })
      .on("pointerover", this.enterMenuButtonHoverState)
      .on("pointerout", this.enterMenuButtonRestState)
      .on("pointerdown", this.enterMenuButtonActiveState)
      .on("pointerup", this.enterMenuButtonHoverState);

    if (onClick) {
      this.on("pointerup", onClick);
    }

    this.enterMenuButtonRestState();
  }

    public setLabelPos(x: number, y: number)
  {
    this.label.x = x + this.width / 2 - this.label.width / 2;
    this.label.y = y + this.height / 2 - this.label.height / 2;
  }


  private enterMenuButtonHoverState() {
    this.label.setColor("#000000");
    this.setFillStyle(0x888888);
  }

  private enterMenuButtonRestState() {
    this.label.setColor("#FFFFFF");
    this.setFillStyle(0x888888);
  }

  private enterMenuButtonActiveState() {
    this.label.setColor("#BBBBBB");
    this.setFillStyle(0x444444);
  }
}
// tslint:disable-next-line: max-classes-per-file
export class Button extends Phaser.GameObjects.Rectangle {
  private label: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number, text: string, onClick?: () => void) {
    super(scene, x, y);
    scene.add.existing(this);
    this.setOrigin(0, 0);

    this.label = scene.add.text(x + padding, y + padding, text).setFontSize(10).setAlign("center");

    const labelWidth = this.label.width + padding;
    const labelHeight = this.label.height + padding;

    this.width = labelWidth >= minimumWidth ? labelWidth : minimumWidth2;
    this.height = labelHeight >= minimumHeight ? labelHeight : minimumHeight2;

    this.setInteractive({ useHandCursor: true })
      .on("pointerover", this.enterMenuButtonHoverState)
      .on("pointerout", this.enterMenuButtonRestState)
      .on("pointerdown", this.enterMenuButtonActiveState)
      .on("pointerup", this.enterMenuButtonHoverState);

    if (onClick) {
      this.on("pointerup", onClick);
    }

    this.enterMenuButtonRestState();
  }

  private enterMenuButtonHoverState() {
    this.label.setColor("#000000");
    this.setFillStyle(0x888888);
  }

  private enterMenuButtonRestState() {
    this.label.setColor("#FFFFFF");
    this.setFillStyle(0x888888);
  }

  private enterMenuButtonActiveState() {
    this.label.setColor("#BBBBBB");
    this.setFillStyle(0x444444);
  }
}
