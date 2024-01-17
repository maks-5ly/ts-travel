import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { LocalstorageService } from '@/service/localstorage'

const httpLink = createHttpLink({
  uri: `${import.meta.env.VITE_API_URL}/graphql`
})

const cache = new InMemoryCache()

const authLink = setContext(async (_, { headers }) => {
  const token = LocalstorageService.getAuthToken()
  return {
    headers: {
      ...headers,
      ...(token && { Authorization: `Bearer ${token}` })
    }
  }
})

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache
})
