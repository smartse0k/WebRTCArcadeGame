class Game {
    addComponent(component) {
        this.components.push(component);

        this.components.sort((left, right) => {
            if (left.layer === right.layer) {
                return 0;
            }
            return left.layer > right.layer ? 1 : -1;
        });
    }

    deleteComponent(component) {
        const index = this.components.indexOf(component);
        this.components.splice(index, 1);
    }

    _update(deltaTime) {
        for (let i=0; i<this.components.length; ++i) {
            const component = this.components[i];
            if (!component) {
                console.error("component is null.");
                continue;
            }

            if (!component.update) {
                console.error("invalid component.");
                continue;
            }

            component.update(deltaTime);
        }
    }

    _render() {
        this.backend.clearRect(0, 0, this.canvasBackend.width, this.canvasBackend.height);
        this.backend.rect(0, 0, this.canvasBackend.width, this.canvasBackend.height);
        this.backend.fillStyle = "#333333";
        this.backend.fill();

        for (let i=0; i<this.components.length; ++i) {
            const component = this.components[i];
            if (!component) {
                console.error("component is null.");
                continue;
            }

            if (!component.update) {
                console.error("invalid component.");
                continue;
            }

            component.render(this.backend);
        }

        this.backend.beginPath(); // path cache 삭제

        this.frontend.clearRect(0, 0, this.canvasFrontend.width, this.canvasFrontend.height);
        this.frontend.drawImage(this.canvasBackend, 0, 0);
    }

    _loop() {
        const now = Date.now();
        const deltaTime = now - this.lastUpdateTime;
        if (deltaTime > this.updateSkipTime) {
            this._update(deltaTime);
            this.lastUpdateTime = now;
        }

        this._render();

        ++this.frameCount;

        requestAnimationFrame(() => {
            this._loop();
        });
    }

    _startFPSCounter() {
        const impl = () => {
            this.fps = this.frameCount;
            this.frameCount = 0;
            //console.log("FPS=%d, Timestamp=%d", this.fps, Date.now());
        };

        setInterval(() => {
            impl();
        }, 1000);
    }

    constructor(canvasBackend, canvasFrontend) {
        this.lastUpdateTime = Date.now();
        this.updateSkipTime = 1000 / 300; // 초당 300번만 업데이트 할 수 있도록.
        this.canvasBackend = canvasBackend;
        this.canvasFrontend = canvasFrontend;
        this.backend = this.canvasBackend.getContext("2d");
        this.frontend = this.canvasFrontend.getContext("2d");

        this._loop();
        this._startFPSCounter();
    }

    lastUpdateTime = 0;
    updateSkipTime = 0;
    frameCount = 0;
    fps = 0;

    /**
     * @type {HTMLCanvasElement}
     */
    canvasBackend = undefined;

    /**
     * @type {HTMLCanvasElement}
     */
    canvasFrontend = undefined;

    /**
     * @type {CanvasRenderingContext2D}
     */
    backend = undefined;

    /**
     * @type {CanvasRenderingContext2D}
     */
    frontend = undefined;

    /**
     * @type {BaseComponent[]}
     */
    components = [];
}