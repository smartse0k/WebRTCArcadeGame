class WebRTC {
    /**
     * @type {PlayerComponent}
     */
    player = undefined;

    /**
     * @type {RTCPeerConnection}
     */
    conn = undefined;

    createConnection() {
        return new RTCPeerConnection({
            iceServers: [
                {
                    urls: "stun:stun.l.google.com:19302"
                },
            ]
        });
    }

    createOfferConnection() {
        this.conn = this.createConnection();

        this.conn.onicecandidate = (ev) => {
            this.onIceCandidate(ev);
        };

        this.channel = this.conn.createDataChannel("game");

        this.channel.onopen = (ev) => {
            this.onChannelStatusChange(ev);
        };
        this.channel.onclose = (ev) => {
            this.onChannelStatusChange(ev);
        };
        this.channel.onmessage = (ev) => {
            this.onChannelMessageReceived(ev);
        };

        return this.conn.createOffer()
            .then((rtcSessionDescription) => {
                return this.conn.setLocalDescription(rtcSessionDescription);
            })
            .then(() => {
                return this.conn;
            });
    }

    /**
     * @param rtcSessionDescription
     */
    createAnswerConnection( rtcSessionDescription) {
        this.conn = this.createConnection();

        this.conn.onicecandidate = (ev) => {
            this.onIceCandidate(ev);
        };

        this.conn.ondatachannel = (ev) => {
            this.channel = ev.channel;

            this.channel.onopen = (ev) => {
                this.onChannelStatusChange(ev);
            };
            this.channel.onclose = (ev) => {
                this.onChannelStatusChange(ev);
            };
            this.channel.onmessage = (ev) => {
                this.onChannelMessageReceived(ev);
            };
        };

        return this.conn.setRemoteDescription(rtcSessionDescription)
            .then(() => {
                return this.conn.createAnswer();
            })
            .then((rtcSessionDescription) => {
                return this.conn.setLocalDescription(rtcSessionDescription);
            })
            .then(() => {
                return this.conn;
            });
    }

    close() {
        if (this.channel) {
            this.channel.close();
        }

        if (this.conn) {
            this.conn.close();
        }
    }

    /**
     * @param {RTCPeerConnectionIceEvent} ev
     */
    onIceCandidate(ev) {
        if (!ev.candidate) {
            return;
        }

        getNetwork().sendRtcIceCandidateExchange(this.player.nickname, ev.candidate);
    }

    /**
     * @param {Event} ev
     */
    onChannelStatusChange(ev) {
        if (!this.channel) {
            return;
        }

        console.log("onChannelStatusChange state=%s", this.channel.readyState);
    }

    /**
     * @param {MessageEvent} ev
     */
    onChannelMessageReceived(ev) {
        //console.log("onChannelMessageReceived => %o", ev);

        try {
            const data = JSON.parse(ev.data);

            switch (data.opcode) {
                case "info":
                    this.player.setInfo(data.info);
                    break;

                case "ping":
                    this.sendData({
                        opcode: "pong",
                        timestamp: data.timestamp,
                    })
                    break;

                case "pong":
                    this.player.onRecvPong(data.timestamp);
                    break;
            }
        } catch (err) {
            console.error(err);
        }
    }

    isDataChannelOpened() {
        if (!this.channel) {
            return false;
        }

        return this.channel.readyState === "open";
    }

    sendData(data) {
        if (!data.opcode) {
            console.error("sendData의 data에는 opcode가 포함되어야 함. data=%o", data);
            return false;
        }

        if (!this.channel) {
            return false;
        }

        if (this.channel.readyState !== "open") {
            return false;
        }

        try {
            this.channel.send(JSON.stringify(data));
        } catch (e) {
            return false;
        }

        return true;
    }

    constructor(player) {
        this.player = player;
    }
}
