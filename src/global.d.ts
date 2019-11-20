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
    user_id: number
}

// Auth
declare interface IPayload {
    user_id: number
    tokenid?: number
    expires?: Date
    unique?: string
}

declare interface IToken {
    user_id: number
    first_name: string
    last_name: string
    role: 'guest' | 'user' | 'admin'
    token: string
}

declare interface IUser {
    id: number
    username: string
    role: 'guest' | 'user' | 'admin'
    hash: string
    first_name: string
    last_name: string
    numberOfNotes: number
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
        note_id?: number
    }
}

// Express
declare namespace Express {
    interface User extends IUser {}
}
