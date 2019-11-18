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
    user?: IUser
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
    notes?: INote[]
    _created: Date
}

// Redux state
declare interface IReduxState {
    token: IToken
    failedLoginAttempts: number
    visibleNotes: INote[]
    draft: {
        content: string
        offset: IPos
        noteId?: number
    }
}

// Express
declare namespace Express {
    interface User extends IUser {}
}
