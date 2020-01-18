import { Input } from "phaser";
import { getGameHeight, getGameWidth } from "../helpers";
import { Button } from "../ui/menu-button";
import { Trace } from "../ui/trace";
import { TraceExport } from "../ui/traceExport";
import { UIUtils } from "../utils/UIUtils";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  // tslint:disable-next-line: object-literal-sort-keys
  key: "Editor",
};


const CircleConnections = new Array();

let testMode: boolean;

let marker: Phaser.GameObjects.Arc;

let wasDown: boolean;
let startLetter;
let startLetterPainted;
let controlPoint: Phaser.GameObjects.Image;

export class Editor extends Phaser.Scene {

  public traces: Trace[];
  public bNextTraceIsNew: boolean;
  public jsonsLoaded: object[];
  public currentLetter: string;
  // Array de objetos que contiene una configuracion por letra
  public letterConfigs: object[];
  // Array de strings, que contiene las letras que estan cargadas
  public keysLoaded: string[];
      // ID de la letra que estamos trazando
      public currentLetterConfigID: number;

  public isTestingDraw: boolean;
  public helpAlphaT: number;
  public helpAlphaSpeed: number;
  public currentConfigTraces: Trace[];
  public pointerOverButton: boolean;
  public deltaSumToPaint: number;
  public shape: Phaser.GameObjects.Graphics;

  constructor() {
    super(sceneConfig);
  }

  public preload() {
  }

  public loadLettersConfigInJson() {
  }

  public create() {

    this.currentLetter = "A";
    this.letterConfigs = new Array();
    this.currentLetterConfigID = 0;
    this.keysLoaded = new Array();

    this.loadLettersConfigInJson();
    this.createBackgroundLayer();
    this.createLetterMarker();

    this.startEditor();

    this.jsonsLoaded = new Array();
    const traceID = 0;

    this.bNextTraceIsNew = false;
    UIUtils.resizeApp(this.game);
  }

  public createBackgroundLayer() {
    const background = this.add.image(this.game.scale.baseSize.width / 2, this.game.scale.baseSize.height / 2, "arena");
    background.displayWidth = this.game.scale.baseSize.width;
    background.displayHeight = this.game.scale.baseSize.height;
  }

  public SpawnMenuButtons() {

    const backButton = new Button(this, 100, this.game.scale.baseSize.height / 20, "Back", () => {
      this.scene.stop("Editor");
      this.scene.start("MainMenu");
    });

    this.assingButtonInputHandle(backButton);

    const symButton = new Button(this, 100, this.game.scale.baseSize.height / 8, "Draw Last", () => {
      this.startDrawTest();
    });
    symButton.width = 100;

    this.assingButtonInputHandle(symButton);

    const  clearDraw = new Button(this, 100, this.game.scale.baseSize.height / 5, "Clear Draw", () => {
      this.clearDraw();
    });
    clearDraw.width = 100;

    this.assingButtonInputHandle(clearDraw);

    const deleteLast = new Button(this, 100,  this.game.scale.baseSize.height / 3, "Delete Last", () => {
      this.deleteLastTrace();
    });
    deleteLast.width = 100;

    this.assingButtonInputHandle(deleteLast);

    const buttonCutTrace = new Button(this, 100, this.game.scale.baseSize.height / 2, "Cut Trace", () => {
      this.cutCurrentTrace();
    });

    this.assingButtonInputHandle(buttonCutTrace);

    const buttonExportTrace = new Button(this, 100, this.game.scale.baseSize.height / 1.5, "Export Trace", () => {
      this.exportTrace();
    });

    this.assingButtonInputHandle(buttonExportTrace);

    buttonCutTrace.scaleX = 1.5;
    buttonExportTrace.scaleX = 1.7;
  }

  public startGameTest() {
    this.scene.start("Game");
    this.scene.stop("Editor");
  }

  public symPoint() {
    const localTrace = new Trace(this);
    const oldTrace = this.traces[this.traces.length - 1];
    localTrace.addPoint(new Phaser.Math.Vector2(oldTrace.startPoint.x, oldTrace.startPoint.y) , true, this);

    localTrace.addPoint(new Phaser.Math.Vector2(((oldTrace.startPoint.x - oldTrace.endPoint.x) * 2) +
     oldTrace.endPoint.x , oldTrace.endPoint.y) , true, this);

    this.traces[this.traces.length] = localTrace;
  }

  public assingButtonInputHandle(buttonToBind: Button) {
    buttonToBind.on("pointerover", () =>
    {
      this.pointerOverButton = true;
    });

    buttonToBind.on("pointerout", () =>
    {
      this.pointerOverButton = false;
    });
  }

  public isItOverButton() {
    return this.pointerOverButton;
  }

  public cutCurrentTrace() {
    this.bNextTraceIsNew = true;
  }

  public importTrace() {
  }

  public exportTrace() {
  }

  public startEditor() {
    marker = this.add.circle(0, 0, 30, 0xFF0000, 0.5);
    wasDown = false;
    testMode = false;

    const startPoint = new Phaser.Math.Vector2(50, 260);
    const controlPoint1 = new Phaser.Math.Vector2(610, 25);
    const controlPoint2 = new Phaser.Math.Vector2(320, 370);
    const endPoint = new Phaser.Math.Vector2(735, 550);

    this.SpawnMenuButtons();
    this.traces = new Array();

    const worldCenterX = this.game.scale.baseSize.width / 2;
    const worldCenterY = this.game.scale.baseSize.height / 2;

    this.createStartLetter(worldCenterX, worldCenterY);
  }

  public createStartLetter(worldCenterX: number, worldCenterY: number) {
    startLetterPainted = this.add.text(worldCenterX, worldCenterY, "A",
      {
        color: "#FF0000",
        fontFamily: "Verdana",
        fontSize: this.game.scale.baseSize.width / 3,
        },
      );

    startLetterPainted.x -= (startLetterPainted.displayWidth / 2);
    startLetterPainted.y -= (startLetterPainted.displayHeight * 2 / 3);
    startLetterPainted.depth = 5;

    startLetter = this.add.text(worldCenterX, worldCenterY, "A",
      {
        color: "#000000",
        fontFamily: "Verdana",
        fontSize: this.game.scale.baseSize.width / 3 ,
        },
      );

    startLetter.alpha = 0.2;
    startLetter.x -= (startLetter.displayWidth / 2);
    startLetter.y -= (startLetter.displayHeight * 2 / 3);
    startLetter.depth = 10;

    this.shape = this.add.graphics();
    this.shape.alpha = 0;
    this.shape.depth = 0;

    const mask = this.shape.createGeometryMask();
    startLetterPainted.mask = mask;

    startLetterPainted.text = this.currentLetter;
    startLetter.text = this.currentLetter;
  }

  public editorOnPointerDown() {
    testMode = !testMode;
  }

  public updateEditor() {
      this.updateEditorNoTestMode();
      this.traces.forEach((element) => {
        element.drawTrace();
      });
  }

  public updateEditorNoTestMode() {
    if (testMode) {
    return;
    }

    this.updateInput();
  }


  public updateInput() {
    if (this.isMouseOverAnyTraceControlPoint()) {
      return;
    }

    if (this.game.input.mousePointer.isDown && !wasDown && !this.isItOverButton()) {
      wasDown = true;
      this.TryToAddConnection();
    }
    if (!this.game.input.mousePointer.isDown && wasDown) {
      wasDown = false;
    }
  }

  public isMouseOverAnyTraceControlPoint(): boolean {
    // tslint:disable-next-line: max-line-length
    // tslint:disable-next-line: prefer-for-of
    for(let i = 0; i < this.traces.length; i++)
    {
      if (this.traces[i].isMouseOverAnyControlPoint() === true) {
        return true;
      }
    }

    return false;
  }

  public updateMarkerPosition() {
    marker.x = this.game.input.activePointer.x;
    marker.y = this.game.input.activePointer.y;
  }

  public TryToAddConnection() {
    // add first start point or first start point of new trace
    if (this.traces.length === 0 || this.bNextTraceIsNew  === true) {
      const localTrace = new Trace(this);
      // tslint:disable-next-line: max-line-length
      localTrace.addPoint(new Phaser.Math.Vector2(this.game.input.activePointer.x, this.game.input.activePointer.y) , true, this);

      if (this.bNextTraceIsNew === true) {
        this.traces[this.traces.length] = localTrace;
        this.bNextTraceIsNew = false;
      } else {
        this.traces[0] = localTrace;
      }
    } else if (this.traces[this.traces.length - 1].endPoint === undefined) {
      const lastTrace = this.traces[this.traces.length - 1];
      // tslint:disable-next-line: max-line-length
      lastTrace.addPoint(new Phaser.Math.Vector2(this.game.input.activePointer.x, this.game.input.activePointer.y) , true, this);
    } else {
        const localTrace = new Trace(this);
        const lastTrace = this.traces[this.traces.length - 1];

        localTrace.addPoint(lastTrace.endPoint, true, this);
        // tslint:disable-next-line: max-line-length
        localTrace.addPoint(new Phaser.Math.Vector2(this.game.input.activePointer.x, this.game.input.activePointer.y) , true, this);

        this.traces[this.traces.length] = localTrace;
    }
  }
  public setupConnection() {
    const circleB  = CircleConnections[CircleConnections.length - 1].CircleB;
    const circleA  = CircleConnections[CircleConnections.length - 1].CircleA;

    const distanceX = circleA.x - circleB.x;
    const distanceY = circleA.y - circleB.y;

    const marksToAddX = Math.round(Math.abs(distanceX / marker.radius));
    const marksToAddY = Math.round(Math.abs(distanceY / marker.radius));

    const marksToAddMax = marksToAddX > marksToAddY ? marksToAddX : marksToAddY;

    const plusDistanceX = distanceX / marksToAddMax;
    const plusDistanceY = distanceY / marksToAddMax;

    let i = 0;
    for (i = 0 ; i <= marksToAddMax; i++) {
      let startX = 0;
      let startY = 0;

      startX = circleA.x - (i * plusDistanceX);
      startY = circleA.y - (i * plusDistanceY);
      this.add.circle(startX, startY, 30, 0x00FF00, 0.1);
      CircleConnections[CircleConnections.length - 1].PointsBetween[i] = {
      posX: startX,
      posY: startY,
      };
    }
  }

  public update(time: any, delta: number) {
    this.updateEditor();
    this.updateTestDraw(delta);
  }

  public createLetterMarker() {
    const traceData = this.letterConfigs[this.currentLetterConfigID] as object[];
    const traceItem = traceData[0] as Trace;
    controlPoint = this.add.image(traceItem.startPoint.x, traceItem.startPoint.y, "punto", 1);
    controlPoint.alpha = 0.3;
    controlPoint.depth = 20;
    controlPoint.setScale(this.game.scale.baseSize.width / 1450);
  }
  public paintIfDeltaEnough(targetAddDelta: number, currentT: number) {
    if (this.currentConfigTraces.length === 0) {
      return;
    }

    this.deltaSumToPaint += targetAddDelta;
    this.shape.depth = 0;
    if (this.deltaSumToPaint >= 0.03) {
      const trace = this.currentConfigTraces[this.currentConfigTraces.length - 1];

      for (let i = 0 ; i < targetAddDelta; i += 0.01) {
        const getPointAt2 = new Phaser.Math.Vector2(0, 0);

        trace.curve.getPointAt(currentT + i, getPointAt2);
        controlPoint.x = getPointAt2.x;
        controlPoint.y = getPointAt2.y;
        this.shape.fillRect(getPointAt2.x - (this.game.scale.baseSize.width / 60),
          getPointAt2.y - (this.game.scale.baseSize.width / 60),(this.game.scale.baseSize.width / 30)
           , (this.game.scale.baseSize.width / 30));
      }

      this.deltaSumToPaint = 0;
    }
  }

  private clearDraw() {
    this.shape.clear();
  }

  private startDrawTest() {
    this.isTestingDraw = true;
    this.helpAlphaSpeed = 1;
    this.helpAlphaT = 0;
    this.deltaSumToPaint = 0;
    this.currentConfigTraces = new Array();
    this.shape.clear();
    for (let i = 0; i < this.traces.length; i++) {
      const trace = new Trace(this);
      this.currentConfigTraces[this.currentConfigTraces.length] = trace.createTrace(
        new Phaser.Math.Vector2(this.traces[i].startPoint.x, this.traces[i].startPoint.y),
        new Phaser.Math.Vector2(this.traces[i].controlPoint1.x, this.traces[i].controlPoint1.y),
        new Phaser.Math.Vector2(this.traces[i].controlPoint2.x, this.traces[i].controlPoint2.y),
        new Phaser.Math.Vector2(this.traces[i].endPoint.x, this.traces[i].endPoint.y), 32,
        this, false);
    }
  }

  private deleteLastTrace() {
    if (this.traces.length === 0) {
      return;
    }

    this.traces[this.traces.length - 1].destroy();
    // this.traces[this.traces.length - 1] = null; Removed by intelisense
    this.traces.splice(this.traces.length - 1 , 1);
  }

  private updateTestDraw(delta: number) {
    if (!this.isTestingDraw) {
      return;
    }

    this.helpAlphaT += this.helpAlphaSpeed * delta / 1000;
    this.helpAlphaT = Phaser.Math.Clamp(this.helpAlphaT, 0 , 1);

    this.paintIfDeltaEnough(this.helpAlphaSpeed * delta / 1000, this.helpAlphaT);

    if (this.helpAlphaT === 1) {
      this.helpAlphaT = 0;
      this.isTestingDraw = false;
      const trace = this.currentConfigTraces[this.currentConfigTraces.length - 1];
      const getPointAt2 = new Phaser.Math.Vector2(0, 0);

      trace.curve.getPointAt(0, getPointAt2);
      controlPoint.x = getPointAt2.x;
      controlPoint.y = getPointAt2.y;
    }
  }

}
