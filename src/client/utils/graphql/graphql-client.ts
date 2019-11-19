/** @format */

import { ApolloClient } from 'apollo-client'
import { InMemoryCache, defaultDataIdFromObject } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { ApolloLink, Observable, Operation } from 'apollo-link'
import fetch from 'isomorphic-fetch'

import { tokenHolder } from '../useLogin'

const cache = new InMemoryCache()

const request = (operation: Operation) => {
    operation.setContext({
        headers: {
            authorization: tokenHolder.token ? `Bearer ${tokenHolder.token}` : undefined,
        },
    })
}

const requestLink = new ApolloLink(
    (operation, forward) =>
        new Observable((observer) => {
            let handle: any
            Promise.resolve(operation)
                .then((oper) => request(oper))
                .then(() => {
                    handle = forward(operation).subscribe({
                        next: observer.next.bind(observer),
                        error: observer.error.bind(observer),
                        complete: observer.complete.bind(observer),
                    })
                })
                .catch(observer.error.bind(observer))

            return () => {
                if (handle) handle.unsubscribe()
            }
        }),
)

export const client = new ApolloClient({
    link: ApolloLink.from([
        requestLink,
        new HttpLink({
            uri: '/api/graphql',
            credentials: 'include',
            fetch,
        }),
    ]),
    cache,
})
