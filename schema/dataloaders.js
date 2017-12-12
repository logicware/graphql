import DataLoader from 'dataloader';


async function batchUsers (User, keys) {
  return await User.findAll({ where: { id: {$in: keys} } });
}

export default ({User}) =>({
  userLoader: new DataLoader(
    keys => batchUsers(User, keys),
    {cacheKeyFn: key => key.toString()},
  ),
});