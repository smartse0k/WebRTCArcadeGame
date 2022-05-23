export const enum OPCODE {
    echo = "echo",
    setNicknameRequest = "setNicknameRequest",
    setNicknameResponse = "setNicknameResponse",
    userJoinNotify = "userJoinNotify",
    userLeaveNotify = "userLeaveNotify",
    userListNotify = "userListNotify",
    rtcOfferDescriptionNotifyRequest = "rtcOfferDescriptionNotifyRequest",
    rtcOfferDescriptionNotify = "rtcOfferDescriptionNotify",
    rtcAnswerDescriptionNotifyRequest = "rtcAnswerDescriptionNotifyRequest",
    rtcAnswerDescriptionNotify = "rtcAnswerDescriptionNotify",
    rtcIceCandidateExchangeRequest = "rtcIceCandidateExchangeRequest",
    rtcIceCandidateExchangeNotify = "rtcIceCandidateExchangeNotify",
}

export interface Base {
    opcode: OPCODE;
}

export interface Echo extends Base {
    message: string;
}

export interface SetNicknameRequest extends Base {
    nickname: string;
}

export interface SetNicknameResponse extends Base {
    success: boolean;
    nickname?: string;
    reason?: string;
}

export interface UserJoinNotify extends Base {
    nickname: string;
}

export interface UserLeaveNotify extends Base {
    nickname: string;
}

export interface UserListNotify extends Base {
    nicknames: string[];
}

export interface RtcOfferDescriptionNotifyRequest extends Base {
    targetNickname: string;
    description: any;
}

export interface RtcOfferDescriptionNotify extends Base {
    senderNickname: string;
    description: any;
}

export interface RtcAnswerDescriptionNotifyRequest extends Base {
    targetNickname: string;
    description: any;
}

export interface RtcAnswerDescriptionNotify extends Base {
    success: boolean;
    senderNickname: string;
    description?: any;
    reason?: string;
}

export interface RtcIceCandidateExchangeRequest extends Base {
    targetNickname: string;
    candidate: any;
}

export interface RtcIceCandidateExchangeNotify extends Base {
    success: boolean;
    senderNickname: string;
    candidate?: any;
    reason?: string;
}
