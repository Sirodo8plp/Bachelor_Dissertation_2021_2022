import { gql } from "@apollo/client";

export const ME_QUERY = gql`
  query Me {
    me {
      id
      username
    }
  }
`;

export const GET_LOCATIONS_QUERY = gql`
  query getLocations {
    locations {
      error
      locations {
        city
        region
        id
        photographs {
          id
        }
      }
    }
  }
`;

export const GET_POSTCARD_BY_ID_QUERY = gql`
  query findPostcardByID($id: String!) {
    findPostcardById(id: $id) {
      id
      description
      location {
        city
        region
      }
      photographs {
        id
        imageLink
        transactionHash
      }
    }
  }
`;

export const GET_POSTCARDS_QUERY = gql`
  query LoadPostcard {
    getPostcards {
      description
      specialID
      id
    }
  }
`;

export const GET_PHOTO_INFO_QUERY = gql`
  query getUserPhotographsInformation {
    getUserPhotographs {
      images {
        id
        imageLink
        location {
          id
          city
          region
        }
      }
    }
  }
`;
