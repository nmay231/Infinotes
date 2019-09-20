/** @format */

import * as React from 'react'

export const dummyUser: IToken = {
    token: undefined,
    firstName: 'first',
    lastName: 'last',
    userid: -1,
    role: 'guest',
}

export const LoginContext = React.createContext<
    [IToken, React.Dispatch<React.SetStateAction<IToken>>]
>([dummyUser, (user: IToken) => console.log('You should not see this')])

export const LoginProvider: React.FC = ({ children }) => {
    const [user, setUser] = React.useState<IToken>(dummyUser)

    return <LoginContext.Provider value={[user, setUser]}>{children}</LoginContext.Provider>
}
