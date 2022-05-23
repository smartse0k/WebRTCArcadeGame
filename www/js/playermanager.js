class PlayerManager {
    /**
     * @type {Map<string, PlayerComponent>}
     */
    players = new Map();

    /**
     * @param {PlayerComponent} player
     */
    addPlayer(player) {
        this.players.set(player.nickname, player);
        getGame().addComponent(player);
    }

    /**
     * @return {PlayerComponent}
     */
    getPlayer(nickname) {
        return this.players.get(nickname);
    }

    deletePlayer(nickname) {
        const player = this.players.get(nickname);
        if (!player) {
            return;
        }

        player.destroy();

        getGame().deleteComponent(player);

        this.players.delete(nickname);
    }

    broadcast(data) {
        this.players.forEach((player) => {
            if (player.webRTC.isDataChannelOpened()) {
                player.webRTC.sendData(data);
            }
        });
    }
}
