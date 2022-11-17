const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const goal_categories = sequelize.define(
    'goal_categories',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
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

  goal_categories.associate = (db) => {
    db.goal_categories.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.goal_categories.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return goal_categories;
};
