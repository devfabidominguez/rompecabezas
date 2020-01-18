import * as Phaser from 'phaser';

export class TraceExport
{  
    startPoint: Phaser.Math.Vector2;
    controlPoint1: Phaser.Math.Vector2;
    controlPoint2: Phaser.Math.Vector2;
    endPoint: Phaser.Math.Vector2;
    path = { t: 0, vec: new Phaser.Math.Vector2() };

    constructor(  
        startPoint: Phaser.Math.Vector2,
        controlPoint1: Phaser.Math.Vector2,
        controlPoint2: Phaser.Math.Vector2,
        endPoint: Phaser.Math.Vector2,
        path = { t: 0, vec: new Phaser.Math.Vector2()}
      )
    {
        this.startPoint = startPoint;
        this.controlPoint1 = controlPoint1;
        this.controlPoint2 = controlPoint2;
        this.endPoint = endPoint; 
        this.path = path;    
    }
};
