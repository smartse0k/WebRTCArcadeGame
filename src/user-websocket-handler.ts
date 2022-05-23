import {deleteUser, findUser, getAuthUserMap, setAuthUser, User} from "./user";
import {WebSocket} from "ws";
import * as WebsocketProtocol from "./websocket-protocol";
import {
    OPCODE,
    RtcAnswerDescriptionNotify, RtcIceCandidateExchangeNotify,
    RtcOfferDescriptionNotify,
    SetNicknameResponse,
    UserJoinNotify,
    UserListNotify
} from "./websocket-protocol";

export class UserWebsocketHandler {
    onEcho(data: WebsocketProtocol.Echo) {
        const sendData: WebsocketProtocol.Echo = {
            opcode: OPCODE.echo,
            message: data.message
        };
        this.user.send(sendData);
    }

    onSetNickname(data: WebsocketProtocol.SetNicknameRequest) {
        const users: User[] = Array.from(getAuthUserMap().values());

        // 닉네임 중복 검사
        let canUse: boolean = true;
        for (const user of users) {
            if (!user.nickname) {
                continue;
            }

            if (user.nickname === data.nickname) {
                canUse = false;
                break;
            }
        }

        if (!canUse) {
            const sendData: SetNicknameResponse = {
                opcode: OPCODE.setNicknameResponse,
                success: false,
                reason: "중복 닉네임"
            }
            this.user.send(sendData);
            return;
        }

        this.user.nickname = data.nickname;
        setAuthUser(this.user);

        // 결과 전송
        const sendData: SetNicknameResponse = {
            opcode: OPCODE.setNicknameResponse,
            success: true,
            nickname: this.user.nickname,
        }
        this.user.send(sendData);

        // 다른 유저에게 참여 전송
        const userNicknames: string[] = [];
        for (const user of users) {
            if (!user.nickname) {
                continue;
            }

            const sendData: UserJoinNotify = {
                opcode: OPCODE.userJoinNotify,
                nickname: data.nickname
            }
            user.send(sendData);

            userNicknames.push(user.nickname);
        }

        // 다른 유저 목록 전송
        const sendUserListData: UserListNotify = {
            opcode: OPCODE.userListNotify,
            nicknames: userNicknames
        }
        this.user.send(sendUserListData);
    }

    onRtcOfferDescriptionNotify(data: WebsocketProtocol.RtcOfferDescriptionNotifyRequest) {
        const user: User | undefined = findUser(data.targetNickname);
        if (!user) {
            const sendData: RtcAnswerDescriptionNotify = {
                opcode: OPCODE.rtcAnswerDescriptionNotify,
                success: false,
                senderNickname: this.user.nickname,
                reason: `상대방(${data.targetNickname})이 존재하지 않음`,
            }
            this.user.send(sendData);
            return;
        }

        const sendData: RtcOfferDescriptionNotify = {
            opcode: OPCODE.rtcOfferDescriptionNotify,
            senderNickname: this.user.nickname,
            description: data.description
        };
        user.send(sendData);
    }

    onRtcAnswerDescriptionNotify(data: WebsocketProtocol.RtcAnswerDescriptionNotifyRequest) {
        const user: User | undefined = findUser(data.targetNickname);
        if (!user) {
            const sendData: RtcAnswerDescriptionNotify = {
                opcode: OPCODE.rtcAnswerDescriptionNotify,
                success: false,
                senderNickname: this.user.nickname,
                reason: `상대방(${data.targetNickname})이 존재하지 않음`,
            }
            this.user.send(sendData);
            return;
        }

        const sendData: RtcAnswerDescriptionNotify = {
            opcode: OPCODE.rtcAnswerDescriptionNotify,
            success: true,
            senderNickname: this.user.nickname,
            description: data.description
        };
        user.send(sendData);
    }

    onRtcIceCandidateExchange(data: WebsocketProtocol.RtcIceCandidateExchangeRequest) {
        const user: User | undefined = findUser(data.targetNickname);
        if (!user) {
            const sendData: RtcAnswerDescriptionNotify = {
                opcode: OPCODE.rtcIceCandidateExchangeNotify,
                success: false,
                senderNickname: this.user.nickname,
                reason: `상대방(${data.targetNickname})이 존재하지 않음`,
            }
            this.user.send(sendData);
            return;
        }

        const sendData: RtcIceCandidateExchangeNotify = {
            opcode: OPCODE.rtcIceCandidateExchangeNotify,
            success: true,
            senderNickname: this.user.nickname,
            candidate: data.candidate
        };
        user.send(sendData);
    }

    onRecv(data: any) {
        switch (data.opcode) {
            case WebsocketProtocol.OPCODE.echo:
                this.onEcho(data);
                break;

            case WebsocketProtocol.OPCODE.setNicknameRequest:
                this.onSetNickname(data);
                break;

            case WebsocketProtocol.OPCODE.rtcOfferDescriptionNotifyRequest:
                this.onRtcOfferDescriptionNotify(data);
                break;

            case WebsocketProtocol.OPCODE.rtcAnswerDescriptionNotifyRequest:
                this.onRtcAnswerDescriptionNotify(data);
                break;


            case WebsocketProtocol.OPCODE.rtcIceCandidateExchangeRequest:
                this.onRtcIceCandidateExchange(data);
                break;

            default:
                console.error("not support opcode. opcode=%s", data.opcode);
                break;
        }
    }

    constructor(user: User, ws: WebSocket) {
        this.user = user;
        this.ws = ws;

        ws.on("close", (code: number, reason: Buffer) => {
            deleteUser(user);
        });

        ws.on("message", (data: string, isBinary) => {
            try {
                this.onRecv(JSON.parse(data));
            } catch (err) {
                console.error(err);
            }
        });
    }

    private user: User;
    private ws: WebSocket;
}