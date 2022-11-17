const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const action_items = sequelize.define(
    'action_items',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.TEXT,
      },

      status: {
        type: DataTypes.TEXT,
      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  action_items.associate = (db) => {
    db.action_items.belongsTo(db.goals, {
      as: 'goal',
      foreignKey: {
        name: 'goalId',
      },
      constraints: false,
    });

    db.action_items.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.action_items.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return action_items;
};
