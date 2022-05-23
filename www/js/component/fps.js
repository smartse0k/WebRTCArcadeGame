class FpsComponent extends BaseComponent {
    layer = 1000;
    visible = true;

    /**
     * @param {number} deltaTime
     */
    update(deltaTime) {

    };

    /**
     * @param {CanvasRenderingContext2D} context
     */
    render(context) {
        const fps = getGame().fps;

        context.fillStyle = "#ffffff";
        context.font = "20px gulimche";
        context.fillText("FPS: " + fps, 450, 50);
    };
}
