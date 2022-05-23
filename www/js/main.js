(() => {
    const sprite = new Sprite();

    const game = new Game(
        document.querySelector("#back-canvas"),
        document.querySelector("#front-canvas"),
    );

    const network = new Network("wss://test.phodobit.kr/socket");
    const thisPlayer = new PlayerComponent();
    const playerManager = new PlayerManager();
    const input = new Input();

    window.getSprite = () => {
        return sprite;
    };

    window.getInput = () => {
        return input;
    };

    window.getGame = () => {
        return game;
    };

    window.getNetwork = () => {
        return network;
    };

    window.getThisPlayer = () => {
        return thisPlayer;
    };

    window.getPlayerManager = () => {
        return playerManager;
    }
    //

    thisPlayer.isLocal = true;
    thisPlayer.layer++;

    //

    game.addComponent(new FpsComponent());
    game.addComponent(thisPlayer);

    //

    showModal(Modal.CONNECTING);
})();
