export default (sequelize, DataTypes) => {
  const Topic = sequelize.define('Topic', {
      text: DataTypes.STRING,
      count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0
        }
      },
      date: {
        type: DataTypes.DATE,
        defaultValue: sequelize.fn('NOW')
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
    },
    {
      timestamps: false,
      indexes: [
        {fields: ['userId']}
      ]
    });

  Topic.associate = function (models) {
    Topic.belongsTo(models.User, {
      foreignKey: 'userId'
    });

    Topic.hasMany(models.Vote, {
      foreignKey: 'topicId'
    });
  };

  Topic.getAllTopics = async function (filter, offset, limit) {
    console.log(filter, offset, limit);
    let query = filter ? buildFilters(filter) : '';

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
      'FROM "Topics" ' + (query ? 'WHERE ' + query : '') + ' order by "text" ' +
      (replacements && replacements.offset ? ' offset :offset ' : '') +
      (replacements && replacements.limit  ? ' limit  :limit '  : ''), options);
  };

  return Topic;
}

function buildFilters(filters) {
  let operator = filters.OR && filters.OR.length ? ' OR ' : '';

  let filter = '';
  if (operator) {
    filter = buildString(operator, filters.OR);
  }

  operator = filters.AND && filters.AND.length ? ' AND ' : '';
  if (operator) {
    filter += (filter ? ' OR ' : '') + buildString(operator, filters.AND);
  }
  return filter;
}

function buildString(operator, conditions) {

  let filter = '';
  conditions.forEach(function(cond) {
    if (cond.text_contains) {
      filter += (filter ? operator : '(') + `text iLIke '%${cond.text_contains}%'`;
    }
    if (cond.date_contains) {
      filter += (filter ? operator : '(') + `"date"::text iLike '%${cond.date_contains}%'`;
    }
    if (cond.postedById) {
      filter += (filter ? operator : '(') + `"userId" = ${cond.postedById}`;
    }
  });
  filter += filter ? ')' : '';
  console.log(filter);
  return filter
}
