export default {
  Query: {
    allUsers: async (root, data, {db: {User}}) => {
      const users = await User.findAll({});
      return users;
    },
    allTopics: async (root, data, {db: {Topic}}) => {
      const topics = await Topic.findAll({});
      return topics;
    },
  },
  Mutation: {
    createUser: async (root, data, {db: {User}}) => {
      const user = await User.create(data);
      return user;
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
      console.log(data);
      const newTopic = {text: data.text, userId: user.id};
      const topic = await Topic.create(newTopic);
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
    postedBy: async (root, data, {db: {User}}) => {
      const {userId} = root;
      return await User.findOne({ where: {id: userId} });
    }
  },

  Vote: {
    user: async (root, data, {db: {User}}) => {
      const {userId} = root;
      return await User.findOne({ where: {id: userId} });
    },
    topic: async (root, data, {db: {Topic}}) => {
      const {topicId} = root;
      return await Topic.findOne({ where: {id: topicId} });
    }

  }

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
