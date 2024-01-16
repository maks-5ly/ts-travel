import gql from 'graphql-tag'

export const DELETE_TRAVEL_MUTATION = gql`
  mutation deleteTravel($id: UUID!) {
    removeTravel(id: $id) {
      name
    }
  }
`

export const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(loginInput: { email: $email, password: $password }) {
      accessToken
      user {
        id
        email
        roles {
          name
        }
      }
    }
  }
`
