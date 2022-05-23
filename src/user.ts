import {WebSocket} from "ws";

import * as WebsocketProtocol from "./websocket-protocol";
import {OPCODE, UserLeaveNotify} from "./websocket-protocol";
import {UserWebsocketHandler} from "./user-websocket-handler";

const users: Set<User> = new Set<User>();
const authUserMap: Map<string, User> = new Map<string, User>();

export function createUser(ws: WebSocket): User {
    const user = new User(ws);
    users.add(user);

    return user;
}

export function deleteUser(user: User) {
    users.delete(user);

    if (!user.nickname) {
        return;
    }

    authUserMap.delete(user.nickname);

    const message: UserLeaveNotify = {
        opcode: OPCODE.userLeaveNotify,
        nickname: user.nickname
    }

    users.forEach((user) => {
        if (!user.nickname) {
            return;
        }

        user.send(message);
    });
}

export function getCurrentUsers(): User[] {
    return Array.from(users);
}

export function getAuthUserMap(): Map<string, User> {
    return authUserMap;
}

export function setAuthUser(user: User) {
    if (!user.nickname) {
        throw new Error("인증되지 않음");
    }
    authUserMap.set(user.nickname, user);
}

export function findUser(nickname: string): User | undefined {
    return authUserMap.get(nickname);
}

export class User {
    send(data: WebsocketProtocol.Base) {
        // todo: 상수 사용 WebSocket.OPEN
        if (this.ws.readyState !== 1) {
            deleteUser(this);
            return;
        }

        this.ws.send(JSON.stringify(data), (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });
    }

    constructor(ws: WebSocket) {
        this.ws = ws;
        this.handler = new UserWebsocketHandler(this, ws);
        this.nickname = "";
    }

    nickname: string;
    private ws: WebSocket;
    private handler: UserWebsocketHandler;
}