class PlayerComponent {
    layer = 100;
    visible = false;

    broadcastDeltaTime = 0;
    pingDeltaTime = 0;

    active = false;
    nickname = "";

    /**
     * @type {WebRTC}
     */
    webRTC = new WebRTC(this);
    isDestroy = false;

    isLocal = false;
    x = 0;
    y = 0;

    pingSendTimestamp = 0;
    ping = 999;

    getInfo() {
        return {
            nickname: this.nickname,
            x: this.x,
            y: this.y,
        };
    }

    setInfo(info) {
        this.nickname = info.nickname;
        this.x = info.x;
        this.y = info.y;
    }

    destroy() {
        this.webRTC.close();
        this.isDestroy = true;
    }

    broadcastMyInfo() {
        getPlayerManager().broadcast({
            opcode: "info",
            info: this.getInfo()
        });
    }

    updateLocalPosition(deltaTime) {
        const v = 0.5 * deltaTime;

        if (getInput().isActiveArrayUp()) {
            this.y -= v;
        }

        if (getInput().isActiveArrayDown()) {
            this.y += v;
        }

        if (getInput().isActiveArrayLeft()) {
            this.x -= v;
        }

        if (getInput().isActiveArrayRight()) {
            this.x += v;
        }

        if (getInput().touchX !== 0) {
            this.x += getInput().touchX;
            getInput().touchX = 0;
        }

        if (getInput().touchY !== 0) {
            this.y += getInput().touchY;
            getInput().touchY = 0;
        }

        this.broadcastDeltaTime += deltaTime;
        if (this.broadcastDeltaTime >= (1000 / 60)) {
            this.broadcastDeltaTime = 0;
            this.broadcastMyInfo();
        }
    }

    updateSendPing(deltaTime) {
        this.pingDeltaTime += deltaTime;
        if (this.pingDeltaTime >= 2000) {
            this.pingDeltaTime = 0;
            this.pingSendTimestamp = Date.now();
            this.webRTC.sendData({
                opcode: "ping",
                timestamp: this.pingSendTimestamp,
            });
        }
    }

    onRecvPong(timestamp) {
        if (this.pingSendTimestamp === timestamp) {
            this.ping = Date.now() - timestamp;
        } else {
            this.ping = 999;
        }
    }

    /**
     * @param {number} deltaTime
     */
    update(deltaTime) {
        if (this.isLocal) {
            this.updateLocalPosition(deltaTime);
        } else {
            this.updateSendPing(deltaTime)
        }
    };

    /**
     * @param {CanvasRenderingContext2D} context
     */
    render(context) {
        if (this.isLocal) {
            getSprite().drawRedStar(context, this.x, this.y, 30, 30);
        } else {
            getSprite().drawYellowStar(context, this.x, this.y, 30, 30);
        }

        context.fillStyle = "#ffffff";
        context.font = "18px gulimche";
        context.fillText(this.nickname, this.x, this.y + 40);

        if (!this.isLocal) {
            context.fillText(this.ping + "ms", this.x, this.y + 60);
        }
    };
}
