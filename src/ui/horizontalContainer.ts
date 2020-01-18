import { UIUtils } from "./../utils/UIUtils";

export class HorizontalContainer {
    public horizontalContainer: Phaser.GameObjects.Container;
    public constructor(x: number, y: number, scene: Phaser.Scene, objects: Phaser.GameObjects.Image[] | null) {
        this.horizontalContainer = scene.add.container(x, y);

        if (objects != null) {
            this.horizontalContainer.add(objects);
            // tslint:disable-next-line: prefer-for-of
            const halfObjects = objects.length / 2;
            for (let i = 0; i < objects.length; i++) {
                if(halfObjects - i >= 0)
                {
                    objects[i].x -= objects[i].displayWidth * (halfObjects - i);
                } else {
                    objects[i].x -= objects[i].displayWidth * (halfObjects - i);
                }

                objects[i].y -= objects[i].displayHeight / 2;
            }
        }
    }
}
