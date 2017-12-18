import pubsub from './pubsub';
import Sequelize from "sequelize";

export default {
  Query: {
    allUsers: async (root, data, {db: {User}}) => {
      return await User.findAll({});
    },
    allTopics: async (root, {filter, offset, limit}, {db: {Topic}}) => {
      return await Topic.getAllTopics(filter, offset, limit);
    },
    userById: async (root, {userId}, {db: {User}}) => {
      return await User.findById(userId);
    },
    topicById: async (root, {topicId}, {db: {Topic}}) => {
      return await Topic.findById(topicId);
    }
  },
  Mutation: {
    createUser: async (root, data, {db: {User}}) => {
      return await User.create(data);
    },
    signinUser: async (root, data, {db: {User, Token}}) => {
      const user = await User.findOne({where: {email: data.email.email}});
      if (user.comparePassword(data.email.password)) {
        const token = user.generateJWT();
        const loginRecord = {
          userId: user.id,
          kind: 'email',
          accessToken: token
        };
        await Token.create(loginRecord);
        return {token, user};
      }
    },
    createTopic: async (root, data, {db: {Topic}, user}) => {
      if (!user) {
        throw (new Error("Unauthorized"));
      }
      console.log(data);
      const newTopic = {text: data.text, userId: user.id};
      const topic = await Topic.create(newTopic);

      pubsub.publish('Topic', {Topic: {mutation: 'CREATED', node: topic}});

      return topic;
    },
    createVote: async (root, data, {db: {Vote, Topic, sequelize}, user}) => {
      const newVote = {
        userId: user && user.id,
        topicId: data.topicId,
      };
      const vote = await Vote.create(newVote);
      if (vote) {
        await Topic.update({ count: sequelize.literal('count + 1')}, {where: {id: vote.topicId}});
      }
      return vote;
    },
  },

  Topic: {
    postedBy: async ({userId}, data, {dataloaders: {userLoader}}) => {
      return await userLoader.load(userId);
    },
    votes: async (root, data, {db: {Vote}}) => {
      const {id} = root;
      return await Vote.findAll({ where: {topicId: id} });
    }

  },

  Vote: {
    user: async ({userId}, data, {dataloaders: {userLoader}}) => {
      return await userLoader.load(userId);
    },
    topic: async (root, data, {db: {Topic}}) => {
      const {topicId} = root;
      return await Topic.findOne({ where: {id: topicId} });
    }
  },

  User: {
    votes: async ({id}, data, {db: {Vote}}) => {
      return await Vote.findAll({where :{userId: id}});
    },
    topics: async ({id}, data, {db: {Topic}}) => {
      return await Topic.findAll({where :{userId: id}});
    }
  },

  Subscription: {
    Topic: {
      subscribe: () => pubsub.asyncIterator('Topic'),
    },
  },

};

/*
const users = [
  {
    id: 1,
    email: 'a@b.com',
    name: 'User A'
  },
  {
    id: 2,
    email: 'b@c.com',
    name: 'User B'
  },
];

export default {
  Query: {
    allUsers: () => users
  },
  Mutation: {
    createUser: (_, data) => {
      const newUser = Object.assign({id: users.length}, data);
      users.push(newUser);
      return newUser;
    }
  }
};*/
