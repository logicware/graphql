import {makeExecutableSchema} from 'graphql-tools';
import resolvers from './resolvers';

// Define your types here.
const typeDefs = `
  type User {
    id: ID!
    email: String!
    name: String!
    gender: String
  }
  
  input AuthProviderSignupData {
    email: AUTH_PROVIDER_EMAIL
  }

  input AUTH_PROVIDER_EMAIL {
    email: String!
    password: String!
  }

  type SigninPayload {
    token: String
    user: User
  }
  
  type Topic {
    id: ID!
    text: String!
    count: Int!
    date: String!
    postedBy: User
  }

  type Query {
    allUsers: [User!]!
    allTopics: [Topic!]
    Topic: Topic!
  }

  type Mutation {
    createUser(email: String!, name: String!, password: String!, gender: String): User   
    signinUser(email: AUTH_PROVIDER_EMAIL): SigninPayload!
    createTopic(text: String!): Topic
    
  }
`;

// Generate the schema object from your types definition.
export default makeExecutableSchema({typeDefs, resolvers});
