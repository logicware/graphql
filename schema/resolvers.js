import pubsub from './pubsub';
import Sequelize from "sequelize";

function buildFilters(OR) {
  let filter = '';
  if (OR.length) {
    OR.forEach(function(cond) {
      if (cond.text_contains) {
        filter += (filter ? ' OR ' : '') + `text iLIke '%${cond.text_contains}%'`;
      }
      if (cond.date_contains) {
        filter += (filter ? ' OR ' : '') + `"date"::text iLike '%${cond.date_contains}%'`;
      }
      if (cond.postedById) {
        filter += (filter ? ' OR ' : '') + `"userId" = ${cond.postedById}`;
      }
    });
    console.log(filter);
  }

  return filter;
}

async function getAllTopics(sequelize, query, offset, limit) {
  let options = { type: sequelize.QueryTypes.SELECT };
  let replacements;
  if (offset) {
    replacements = { offset };
  }
  if (limit) {
      replacements = { ...replacements, limit };
  }
  console.log(replacements);
  if (replacements) {
    options.replacements = replacements;
  }
  return sequelize.query(
    'SELECT * ' +
    'FROM "Topics" ' + (query ? 'WHERE ' + query : ' order by "text" ') +
    (replacements && replacements.offset ? ' offset :offset ' : '') +
    (replacements && replacements.limit  ? ' limit  :limit '  : ''), options);
}

export default {
  Query: {
    allUsers: async (root, data, {db: {User}}) => {
      return await User.findAll({});
    },
    allTopics: async (root, {filter, offset, limit}, {db: {sequelize}}) => {
      console.log(filter, offset, limit);
      let query = filter ? buildFilters(filter.OR) : '';
      return await getAllTopics(sequelize, query, offset, limit);
    },
    userById: async (root, {userId}, {db: {User}}) => {
      return await User.findById(userId);
    }
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
