export default {
  Query: {
    allUsers: async (root, data, {db: {User}}) => {
      const users = await User.findAll({});
      return users;
    }
  },
  Mutation: {
    createUser: async (root, data, {db: {User}}) => {
      const user = await User.create(data);
      return user;
    }
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
