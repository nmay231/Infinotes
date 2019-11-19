/** @format */

// Project: Infinotes
// Definitions by: Noah May <https://github.com/nmay231>

// General
declare interface IPos {
    x: number
    y: number
}

declare interface INote {
    id: number
    content: string
    offset: IPos
    user: IUser
}

declare interface IDraft {
    id: number
    noteId?: number
    content: string
    offset: IPos
    user: IUser
}

declare interface IUser {
    id: number
    username: string
    role: 'guest' | 'user' | 'admin'
    firstName: string
    lastName?: string
    fullName: string
    notes: INote[]
    numberOfNotes: number
    _created: Date
}

// Auth
declare interface IPayload {
    userid: number
    tokenid?: number
    expires?: Date
    unique?: string
}

declare namespace DB {
    interface User {
        id: number
        username: string
        role: string
        hash: string
        firstName: string
        lastName: string
        _created: Date
    }
    interface Note {
        id: number
        userid: number
        content: string
        posx: number
        posy: number
        _created: Date
    }
    interface Draft {
        id: number
        note_id: number
        content: string
        posx: number
        posy: number
        user_id: number
        _created: Date
    }
    interface Token {
        id: number
        userid: number
        token: string
        expires: Date
        _created: Date
    }
}

// Express
declare namespace Express {
    interface User extends IUser {}
}
