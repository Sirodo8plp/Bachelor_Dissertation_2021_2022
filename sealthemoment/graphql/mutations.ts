import { gql } from "@apollo/client";

export const CREATE_POSTCARD_MUTATION = gql`
  mutation createPostcard($inputs: postcardInputs!) {
    createNewPostcard(inputs: $inputs) {
      id
      description
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($password: String!, $username: String!) {
    login(password: $password, username: $username) {
      errors {
        field
        message
      }
      user {
        id
        username
      }
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register(
    $username: String!
    $password: String!
    $firstName: String!
    $lastName: String!
    $email: String!
  ) {
    register(
      inputs: {
        username: $username
        password: $password
        firstName: $firstName
        lastName: $lastName
        email: $email
      }
    ) {
      errors {
        field
        message
      }
      user {
        id
        username
        email
      }
    }
  }
`;

export const REMOVE_POSTCARD_MUTATION = gql`
  mutation RemovePostcard($pcId: Float!) {
    removePostcardByID(pcID: $pcId)
  }
`;

export const UPDATE_LOCATION_MUTATION = gql`
  mutation updateLocation {
    updateLocation {
      error {
        message
        type
      }
      location {
        region
        city
      }
      message
    }
  }
`;

export const UPLOAD_IMAGES_MUTATION = gql`
  mutation uploadImages($inputs: uploadInputs!) {
    uploadImages(inputs: $inputs) {
      message
      images {
        imageLink
        id
        location {
          city
          region
        }
      }
    }
  }
`;
