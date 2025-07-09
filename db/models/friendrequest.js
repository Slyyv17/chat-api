'use strict';
module.exports = (sequelize, DataTypes) => {
  const friendRequest = sequelize.define('friendRequest', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    senderId: {
      type: DataTypes.INTEGER
    },
    receiverId: {
      type: DataTypes.INTEGER
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
      defaultValue: 'pending',
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    deletedAt: {
      type: DataTypes.DATE
    }
  }, {
    paranoid: true,            // Enables soft deletes
    freezeTableName: true,     // Table name = 'friendRequest', not pluralized
    modelName: 'friendRequest', // Optional, but okay
    timestamps: true           // Enables createdAt/updatedAt automatically
  });

  // 💡 Association setup
  friendRequest.associate = (models) => {
    friendRequest.belongsTo(models.user, {
      as: 'sender',
      foreignKey: 'senderId',
    });
    friendRequest.belongsTo(models.user, {
      as: 'receiver',
      foreignKey: 'receiverId',
    });
  };

  return friendRequest;
}