class Network {
    /**
     * @param {Event} event
     */
    onSocketOpen(event) {
        hideModal(Modal.CONNECTING);
        showModal(Modal.SET_NICKNAME);
    }

    /**
     * @param {CloseEvent} event
     */
    onSocketClose(event) {

    }

    /**
     * @param {Event} event
     */
    onSocketError(event) {

    }

    send(data) {
        this.websocket.send(JSON.stringify(data));
    }

    sendSetNickname(nickname) {
        /**
         * @type {SetNicknameRequest}
         */
        const data = {
            opcode: "setNicknameRequest",
            nickname: nickname,
        };
        this.send(data);
    }

    sendRtcOfferDescription(targetNickname, description) {
        /**
         * @type {RtcOfferDescriptionNotifyRequest}
         */
        const data = {
            opcode: "rtcOfferDescriptionNotifyRequest",
            targetNickname: targetNickname,
            description: description,
        };
        this.send(data);
    }

    sendRtcAnswerDescription(targetNickname, description) {
        /**
         * @type {RtcAnswerDescriptionNotifyRequest}
         */
        const data = {
            opcode: "rtcAnswerDescriptionNotifyRequest",
            targetNickname: targetNickname,
            description: description,
        };
        this.send(data);
    }

    sendRtcIceCandidateExchange(targetNickname, candidate) {
        /**
         * @type {RtcIceCandidateExchangeRequest}
         */
        const data = {
            opcode: "rtcIceCandidateExchangeRequest",
            targetNickname: targetNickname,
            candidate: candidate,
        };
        this.send(data);
    }

    _bind() {
        this.websocket.onopen = (event) => {
            this.onSocketOpen(event);
        };

        this.websocket.onclose = (event) => {
            this.onSocketClose(event);
        };

        this.websocket.onerror = (event) => {
            this.onSocketError(event);
        };

        this.websocket.onmessage = (event) => {
            this.handler.onSocketMessage(event);
        }
    }

    constructor(url) {
        this.websocket = new WebSocket(url);
        this.handler = new NetworkHandler();
        this._bind();
    }

    /**
     * @type {WebSocket}
     */
    websocket = undefined;

    /**
     * @type {NetworkHandler}
     */
    handler = undefined;
}
