export class Trace {
    public startPoint: Phaser.Math.Vector2;
    public controlPoint1: Phaser.Math.Vector2;
    public controlPoint2: Phaser.Math.Vector2;
    public endPoint: Phaser.Math.Vector2;
    public traceNeighbour: Trace;

    public curve: Phaser.Curves.CubicBezier;
    public points: Phaser.Math.Vector2[];
    public path = { t: 0, vec: new Phaser.Math.Vector2() };
    public graphics: Phaser.GameObjects.Graphics;

    public isMouseOverControlPoint: boolean ;
    public scene: Phaser.Scene;

    public images: Phaser.GameObjects.Image[];
    public game: Phaser.Game;

    constructor(scene: Phaser.Scene) {
        this.images = new Array();
        this.isMouseOverControlPoint = false;
        this.game = scene.game;
        this.graphics = scene.add.graphics();

        scene.input.on("drag", (pointer: any, gameObject: Phaser.GameObjects.GameObject, dragX: any, dragY: any) => {

            const gameObjectCircle = gameObject as Phaser.GameObjects.Shape;
            gameObjectCircle.x = dragX;
            gameObjectCircle.y = dragY;

            gameObject.data.get("vector").set(dragX, dragY);

            //  Get 32 points equally spaced out along the curve
            if (this.curve === undefined) {
                return;
            }

            this.points = this.curve.getSpacedPoints(0);
        });
    }

    public getJsonStringValue(): object {
        // tslint:disable-next-line: max-line-length
        const tempStartPoint = new Phaser.Math.Vector2(this.startPoint.x / this.game.scale.baseSize.width, this.startPoint.y / this.game.scale.baseSize.height);
        // tslint:disable-next-line: max-line-length
        const tempCp1 = new Phaser.Math.Vector2(this.controlPoint1.x / this.game.scale.baseSize.width, this.controlPoint1.y / this.game.scale.baseSize.height);
        // tslint:disable-next-line: max-line-length
        const tempCp2 = new Phaser.Math.Vector2(this.controlPoint2.x / this.game.scale.baseSize.width, this.controlPoint2.y / this.game.scale.baseSize.height);
        // tslint:disable-next-line: max-line-length
        const tempEp = new Phaser.Math.Vector2(this.endPoint.x / this.game.scale.baseSize.width, this.endPoint.y / this.game.scale.baseSize.height);

        const jsonStringValue = {
            path: this.path,
            startPoint: tempStartPoint,
            // tslint:disable-next-line: object-literal-sort-keys
            controlPoint1: tempCp1,
            controlPoint2: tempCp2,
            endPoint : tempEp,
        };
        return jsonStringValue;
    }

    public addPoint(newPoint: Phaser.Math.Vector2, isEditing: boolean, scene: Phaser.Scene) {
        if (this.startPoint === undefined) {
            this.startPoint = newPoint;
            if (isEditing) {
                const imageStartPoint = scene.add.sprite(newPoint.x, newPoint.y, "dragcircle", 0).setInteractive();
                this.addOverAndOutDelegates(imageStartPoint);
                imageStartPoint.setData("vector", newPoint);
                imageStartPoint.setData("isControl", false);
                this.images[this.images.length] = imageStartPoint;
                scene.input.setDraggable([imageStartPoint]);
                imageStartPoint.setScale(this.game.scale.baseSize.width / 1450);
                imageStartPoint.alpha = 0.2;
            }
        } else {
            this.endPoint = newPoint;

            if (isEditing) {
                const point1 = scene.add.image(newPoint.x, newPoint.y, "dragcircle", 0).setInteractive();
                this.addOverAndOutDelegates(point1);
                point1.setData("vector", newPoint);
                point1.setData("isControl", false);
                point1.alpha = 0.2;
                point1.setScale(this.game.scale.baseSize.width / 1450);
                this.images[this.images.length] = point1;
                // tslint:disable-next-line: max-line-length
                const middlePoint = new Phaser.Math.Vector2((this.startPoint.x + point1.x) / 2, (this.startPoint.y + point1.y) / 2);
                this.controlPoint2 = middlePoint;
                // tslint:disable-next-line: max-line-length
                const point3 = scene.add.image(this.controlPoint2.x, this.controlPoint2.y, "dragcircle", 2).setInteractive();
                point3.setScale(this.game.scale.baseSize.width / 1450);

                point3.alpha = 0.2;
                this.images[this.images.length] = point3;

                this.addOverAndOutDelegates(point3);

                point3.setData("vector", this.controlPoint2);
                point3.setData("isControl", true);
                // tslint:disable-next-line: max-line-length
                this.controlPoint1 = new Phaser.Math.Vector2((this.startPoint.x + point1.x) / 2, (this.startPoint.y + point1.y) / 2);
                // tslint:disable-next-line: max-line-length
                const point2 = scene.add.image(this.controlPoint1.x, this.controlPoint1.y, "dragcircle", 2).setInteractive();
                point2.setScale(this.game.scale.baseSize.width / 1450);

                this.addOverAndOutDelegates(point2);
                this.images[this.images.length] = point2;

                point2.alpha = 0.2;
                point2.setData("vector", this.controlPoint1);
                point2.setData("isControl", true);

                scene.input.setDraggable([ point1, point2, point3 ]);
            }
            // tslint:disable-next-line: max-line-length
            this.curve = new Phaser.Curves.CubicBezier(this.startPoint, this.controlPoint1, this.controlPoint2, this.endPoint);
            this.points = this.curve.getSpacedPoints(15);
        }
    }

    public addOverAndOutDelegates(imageTo: Phaser.GameObjects.Image) {
        imageTo.on("pointerover", () => this.setIsMouseOverAnyControlPoint(true));
        imageTo.on("pointerout", () => this.setIsMouseOverAnyControlPoint(false));
    }

    public setIsMouseOverAnyControlPoint(value: boolean) {
        this.isMouseOverControlPoint = value;
    }

    public isMouseOverAnyControlPoint(): boolean {
        return this.isMouseOverControlPoint;
    }

    // tslint:disable-next-line: max-line-length
    public createTrace(startPoint: Phaser.Math.Vector2, controlPoint1: Phaser.Math.Vector2, controlPoint2: Phaser.Math.Vector2, endPoint: Phaser.Math.Vector2, curvePoints: number
        ,              scene: Phaser.Scene, isItForEdit: boolean): Trace {
        this.scene = scene;
        this.startPoint = startPoint;
        this.controlPoint1 = controlPoint1;
        this.controlPoint2 = controlPoint2;
        this.endPoint = endPoint;

        if (isItForEdit) {
            const point0 = scene.add.sprite(startPoint.x, startPoint.y, "dragcircle", 0).setInteractive();
            const point1 = scene.add.sprite(endPoint.x, endPoint.y, "dragcircle", 0).setInteractive();
            const point2 = scene.add.sprite(controlPoint1.x, controlPoint1.y, "dragcircle", 2).setInteractive();
            const point3 = scene.add.sprite(controlPoint2.x, controlPoint2.y, "dragcircle", 2).setInteractive();

            this.addOverAndOutDelegates(point0);
            this.addOverAndOutDelegates(point1);
            this.addOverAndOutDelegates(point2);
            this.addOverAndOutDelegates(point3);

            point0.setData("vector", startPoint);
            point1.setData("vector", endPoint);
            point2.setData("vector", controlPoint1);
            point3.setData("vector", controlPoint2);

            point0.setData("isControl", false);
            point1.setData("isControl", false);
            point2.setData("isControl", true);
            point3.setData("isControl", true);

            scene.input.setDraggable([ point0, point1, point2, point3 ]);
        }

        this.curve = new Phaser.Curves.CubicBezier(startPoint, controlPoint1, controlPoint2, endPoint);
        this.points = this.curve.getSpacedPoints(15);

        return this;
    }

    public setTraceNeighbour(traceNeighbour: Trace) {
        this.traceNeighbour = traceNeighbour;
    }

    public destroy() {
        this.graphics.clear();
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.images.length; i++) {
            this.images[i].destroy();
        }
    }

    public drawTrace() {
        this.graphics.clear();

        //  Draw the curve through the points
        this.graphics.lineStyle(1, 0xff00ff, 1);

        if (this.curve === undefined) {
        return;
        }

        this.curve.draw(this.graphics);

        //  Draw t
        this.curve.getPoint(this.path.t, this.path.vec);

        if (this.points !== undefined && this.points.length > 0 && this.scene !== undefined) {
            this.points.forEach((point) => {
                this.scene.add.circle(point.x, point.y, 5, 0xFFFFFF, 1);
            });
        }
    }
}
