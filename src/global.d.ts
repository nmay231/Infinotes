/** @format */

// Project: Infinotes
// Definitions by: Noah May <https://github.com/nmay231>

// General
declare interface IPos {
    x: number
    y: number
}

declare interface INote {
    content: string
    offset: IPos
}

// Auth
declare interface IPayload {
    userid: number
    tokenid?: number
    expires?: Date
    unique?: string
}

declare interface IToken {
    userid: number
    firstName: string
    lastName: string
    role: 'guest' | 'user' | 'admin'
    token: string
}
