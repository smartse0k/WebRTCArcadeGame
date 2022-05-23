import path from "path";

import express from "express";
import expressWs from "express-ws";

import {createUser} from "./user";


export class Application {
    private readonly port: number;
    private app: expressWs.Application;

    start() {
        this.app.listen(this.port, () => {
            console.log("Application started. port=%d", this.port);
        });
    }

    _createFrontendRouter() {
        const router = express.Router();
        const wwwPath: string = path.resolve(process.cwd(), "www");
        router.use(express.static(wwwPath));
        return router;
    }

    _createWebsocketRouter() {
        const router = express.Router() as expressWs.Router;

        router.ws("/", (ws, req) => {
            const user = createUser(ws);
        });

        return router;
    }

    constructor(port: number) {
        this.port = port;
        const expressInstance = expressWs(express());
        this.app = expressInstance.app;

        this.app.use("/socket", this._createWebsocketRouter());
        this.app.use("/", this._createFrontendRouter());
    }
}
