import gql from 'graphql-tag'

export const TRAVELS_QUERY = gql`
  query getPaginatedTravels($take: Int!, $skip: Int!) {
    travels(take: $take, skip: $skip) {
      data {
        id
        description
        isPublic
        moods {
          culture
          history
          nature
          party
          relax
        }
        name
        numberOfDays
        numberOfNights
        createdAt
        tours(take: 4, skip: 0) {
          data {
            id
            name
          }
        }
      }
      pagination {
        page
        perPage
        totalPage
        total
      }
    }
  }
`
