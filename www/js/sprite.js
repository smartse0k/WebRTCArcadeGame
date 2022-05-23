class Sprite {
    /**
     * @type {HTMLImageElement}
     */
    img;

    /**
     * @param {CanvasRenderingContext2D} context
     */
    drawYellowStar(context, x, y, w, h) {
        context.drawImage(this.img, 3, 1, 30, 30, x, y, w, h);
    }

    drawRedStar(context, x, y, w, h) {
        context.drawImage(this.img, 42, 1, 30, 30, x, y, w, h);
    }

    constructor() {
        this.img = new Image();
        this.img.src = "image/sprite.png";
    }

}