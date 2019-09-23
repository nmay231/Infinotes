/** @format */

// Project: Infinotes
// Definitions by: Noah May <https://github.com/nmay231>

// General
declare interface IPos {
    x: number
    y: number
}

declare interface INote {
    id?: number
    content: string
    offset: IPos
    username: string
    userid: number
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

declare interface IUser {
    id: number
    username: string
    role: 'guest' | 'user' | 'admin'
    hash: string
    firstName: string
    lastName: string
    numberOfNotes: number
    _created: Date
}

declare namespace Express {
    interface User extends IUser {}
}
