export const REGISTER_MUTATION = `
mutation Register($username: String! , $password: String! , $firstName: String!,$lastName: String!, $email: String!) {
                    register(inputs: {
                        username: $username, password: $password , firstName: $firstName,
                        lastName: $lastName, email: $email
                    }) {
                        errors {
                            field
                            message
                        }
                        user {
                            userID
                            username
                            password
                            firstName
                            lastName
                            email
                        }
                    }
                }
`;

export const LOGIN_MUTATION = {

}

export const UPLOAD_IMAGE_MUTATION = {

}

