class NetworkHandler {
    /**
     * @param {MessageEvent} event
     */
    onSocketMessage(event) {
        const data = JSON.parse(event.data);

        switch (data.opcode) {
            case "setNicknameResponse":
                this.onSetNicknameResponse(data);
                break;

            case "userJoinNotify":
                this.onUserJoinNotify(data);
                break;

            case "userLeaveNotify":
                this.onUserLeaveNotify(data);
                break;

            case "rtcOfferDescriptionNotify":
                this.onRtcOfferDescriptionNotify(data);
                break;

            case "rtcAnswerDescriptionNotify":
                this.onRtcAnswerDescriptionNotify(data);
                break;

            case "rtcIceCandidateExchangeNotify":
                this.onRtcCandidateExchangeNotify(data);
                break;

            default:
                console.error("not support opcode. opcode=%s", data.opcode);
                break;
        }
    }

    /**
     * @param {SetNicknameResponse} data
     */
    onSetNicknameResponse(data) {
        if (!data.success) {
            alert(data.reason);
            return;
        }

        hideModal(Modal.SET_NICKNAME);

        getThisPlayer().active = true;
        getThisPlayer().nickname = data.nickname;
    }

    /**
     * @param {UserJoinNotify} data
     */
    onUserJoinNotify(data) {
        if (getThisPlayer().nickname === data.nickname) {
            return;
        }

        const player = new PlayerComponent();
        player.nickname = data.nickname;
        getPlayerManager().addPlayer(player);

        player.webRTC.createOfferConnection(player).then((conn) => {
            const description = conn.localDescription;
            getNetwork().sendRtcOfferDescription(data.nickname, description);
        });
    }

    /**
     * @param {UserLeaveNotify} data
     */
    onUserLeaveNotify(data) {
        const nickname = data.nickname;
        getPlayerManager().deletePlayer(nickname);
    }

    /**
     * @param {RtcOfferDescriptionNotify} data
     */
    onRtcOfferDescriptionNotify(data) {
        const player = new PlayerComponent();
        player.nickname = data.senderNickname;
        getPlayerManager().addPlayer(player);

        player.webRTC.createAnswerConnection(data.description).then((conn) => {
            const description = conn.localDescription;
            getNetwork().sendRtcAnswerDescription(data.senderNickname, description);
        });
    }

    /**
     * @param {RtcAnswerDescriptionNotify} data
     */
    onRtcAnswerDescriptionNotify(data) {
        if (!data.success) {
            alert("WebRTC 연결 실패!\n" + data.reason);
            return;
        }

        const player = getPlayerManager().getPlayer(data.senderNickname);
        if (!player) {
            alert("WebRTC 연결 실패!\n존재하지 않는 플레이어(" + data.senderNickname + ")");
            return;
        }

        player.webRTC.conn.setRemoteDescription(data.description);
    }

    /**
     * @param {RtcIceCandidateExchangeNotify} data
     */
    onRtcCandidateExchangeNotify(data) {
        if (!data.success) {
            alert("WebRTC IceCandidate 교환 실패!\n" + data.reason);
            return;
        }

        const player = getPlayerManager().getPlayer(data.senderNickname);
        if (!player) {
            alert("WebRTC IceCandidate 교환 실패!\n존재하지 않는 플레이어(" + data.senderNickname + ")");
            return;
        }

        player.webRTC.conn.addIceCandidate(data.candidate);
    }
}