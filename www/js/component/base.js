class BaseComponent {
    layer = 0;
    visible = false;

    /**
     * @param {number} deltaTime
     */
    update(deltaTime) {
        throw new Error("구현되지 않음");
    };

    /**
     * @param {CanvasRenderingContext2D} context
     */
    render(context) {
        throw new Error("구현되지 않음");
    };
}