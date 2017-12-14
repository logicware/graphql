import {makeExecutableSchema} from 'graphql-tools';
import resolvers from './resolvers';

// Define your types here.
const typeDefs = `
  type User {
    id: ID!
    email: String!
    name: String!
    gender: String,
    votes: [Vote!]
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
    votes: [Vote!]
  }
  
  type Vote {
    id: ID!
    user: User!
    topic: Topic!
  }

  type Query {
    allUsers: [User!]!
    allTopics(filter: TopicFilter): [Topic!]
  }

  input TopicFilter {
    OR: [TopicFilter!]
    text_contains: String
    date_contains: String
  }
  
  type Mutation {
    createUser(email: String!, name: String!, password: String!, gender: String): User   
    signinUser(email: AUTH_PROVIDER_EMAIL): SigninPayload!
    createTopic(text: String!): Topic    
    createVote(topicId: ID!): Vote
  }
  
  type Subscription {
    Topic(filter: TopicSubscriptionFilter): TopicSubscriptionPayload
  }

  input TopicSubscriptionFilter {
    mutation_in: [_ModelMutationType!]
  }

  type TopicSubscriptionPayload {
    mutation: _ModelMutationType!
    node: Topic
  }

  enum _ModelMutationType {
    CREATED
    UPDATED
    DELETED
  }
`;

// Generate the schema object from your types definition.
export default makeExecutableSchema({typeDefs, resolvers});
