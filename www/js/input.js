class Input {
    keyState = {};

    touchStartX = 0;
    touchStartY = 0;
    touchX = 0;
    touchY = 0;

    isActive(code) {
        return !!this.keyState[code];
    }

    isActiveArrayUp() {
        return !!this.keyState[38];
    }

    isActiveArrayDown() {
        return !!this.keyState[40];
    }

    isActiveArrayLeft() {
        return !!this.keyState[37];
    }

    isActiveArrayRight() {
        return !!this.keyState[39];
    }

    constructor() {
        window.addEventListener("keydown", (ev) => {
            this.keyState[ev.keyCode] = true;
            //console.log("%d down", ev.keyCode);
        });

        window.addEventListener("keyup", (ev) => {
            this.keyState[ev.keyCode] = false;
            //console.log("%d up", ev.keyCode);
        });

        window.addEventListener("touchstart", (ev) => {
            this.touchStartX = ev.changedTouches[0].pageX;
            this.touchStartY = ev.changedTouches[0].pageY;
        });

        window.addEventListener("touchmove", (ev) => {
            this.touchX += ev.changedTouches[0].pageX - this.touchStartX;
            this.touchStartX = ev.changedTouches[0].pageX;
            this.touchY += ev.changedTouches[0].pageY - this.touchStartY;
            this.touchStartY = ev.changedTouches[0].pageY;
        });
    }
}
