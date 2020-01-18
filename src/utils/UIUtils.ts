export class UIUtils {
  // tslint:disable-next-line: align
  public static resizeApp(game: Phaser.Game) {
    const canvas = document.getElementsByTagName("canvas")[0];
    if (canvas != null) {
      const gameScaleRatio = game.scale.width / game.scale.height;
      const invertedGameScaleRatio = game.scale.height / game.scale.width;
      const deviceRatio = window.innerWidth / window.innerHeight;
      if (deviceRatio > gameScaleRatio) {
        canvas.style.width = window.innerHeight * gameScaleRatio + "px";
        canvas.style.height = window.innerHeight + "px";
      } else {
        canvas.style.width = window.innerWidth + "px";
        canvas.style.height = window.innerWidth * invertedGameScaleRatio + "px";
      }
    }
  }

  public static sign(x: number): number {
    return x > 0 ? 1 : -1;
  }
}
