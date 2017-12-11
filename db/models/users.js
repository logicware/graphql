import Promise from 'bluebird';
import bcryptNode from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';

import config from '../../config';

const bcrypt = Promise.promisifyAll(bcryptNode);

function hashPassword(user) {
  if (!user.changed('password')) return null;
  return bcrypt.genSaltAsync(5).then(salt =>
    bcrypt.hashAsync(user.password, salt, null).then((hash) => {
      user.password = hash;
    })
  );
}


export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true
        },
        unique: 'emailIndex'
      },
      password: {
        type: DataTypes.STRING
      },
      name: {
        type: DataTypes.STRING,
        defaultValue: '',
        unique: 'nameIndex'
      },
      gender: {
        type: DataTypes.STRING,
        defaultValue: ''
      },
      location: {
        type: DataTypes.STRING,
        defaultValue: ''
      },
      website: {
        type: DataTypes.STRING,
        defaultValue: ''
      },
      picture: {
        type: DataTypes.STRING,
        defaultValue: ''
      },
      resetPasswordToken: {
        type: DataTypes.STRING
      },
      resetPasswordExpires: {
        type: DataTypes.DATE
      },
      google: {
        type: DataTypes.STRING
      }
    },
    {
      timestamps: false
    }
  );

  User.associate = function (models) {
    User.hasMany(models.Token, {
      foreignKey: 'userId'
    });

    User.hasMany(models.Topic, {
      foreignKey: 'userId'
    });

    User.hasMany(models.Vote, {
      foreignKey: 'userId'
    });

  };

  User.beforeCreate(hashPassword);
  User.beforeUpdate(hashPassword);

  User.prototype.comparePassword = function(candidatePassword) {
    return bcrypt.compareAsync(candidatePassword, this.password);
  };

  User.prototype.toJSON = function() {
    return {
      id: this.id,
      _id: this.id,
      email: this.email,
      profile: {
        name: this.name,
        gender: this.gender,
        location: this.location,
        website: this.website,
        picture: this.picture
      }
    };
  };

  User.prototype.generateJWT = function() {
    const today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
      id: this.id,
      username: this.name,
      exp: parseInt(exp.getTime() / 1000),
    }, config.jwt_secret);
  };

  return User;
};
