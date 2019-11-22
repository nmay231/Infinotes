/** @format */

// Project: Infinotes
// Definitions by: Noah May <https://github.com/nmay231>

// General
declare interface IPos {
    x: number
    y: number
}

declare type Unresolved<T = any> = T | Promise<T>

// declare interface INote {
//     id: number
//     content: string
//     offset: IPos
//     user: IUser
// }

// declare interface IDraft {
//     id: number
//     noteId?: number
//     content: string
//     offset: IPos
//     user: IUser
// }

type UserRole = 'guest' | 'user' | 'admin'
// declare interface IUser {
//     id: number
//     username: string
//     role: UserRole
//     firstName: string
//     lastName: string
//     fullName: string
//     notes: INote[]
//     numberOfNotes: number
//     _created: Date
// }

// Auth
declare interface IPayload {
    user_id: string
    token_id?: string
    expires?: Date
    unique?: string
}

declare interface IToken {
    user_id: string
    firstName: string
    lastName: string
    role: UserRole
    token: string
}

declare namespace DB {
    interface User {
        id: string
        username: string
        role: UserRole
        hash: string
        first_name: string
        last_name: string
        _created: Date
    }
    interface Note {
        id: string
        user_id: string
        content: string
        posx: number
        posy: number
        _created: Date
    }
    interface Draft {
        id: string
        note_id: string
        content: string
        posx: number
        posy: number
        user_id: string
        _created: Date
    }
    interface Token {
        id: string
        user_id: string
        token: string
        expires: Date
        _created: Date
    }
}

// Express
declare namespace Express {
    interface User extends DB.User {}
}
