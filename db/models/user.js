// db/models/user.js
'use strict';

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    username: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    profileImg: {
      type: DataTypes.STRING
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    deletedAt: {
      type: DataTypes.DATE
    }
  }, {
    paranoid: true,            // Enables soft deletes
    freezeTableName: true,     // Table name = 'user', not pluralized
    modelName: 'user',         // Optional, but okay
    timestamps: true           // Enables createdAt/updatedAt automatically
  });

  // 💡 Association setup
  user.associate = (models) => {
    user.hasMany(models.friendRequest, {
      as: 'sentRequests',
      foreignKey: 'senderId',
    });
    user.hasMany(models.friendRequest, {
      as: 'receivedRequests',
      foreignKey: 'receiverId',
    });
  };
  return user;
};
