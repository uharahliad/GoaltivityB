const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const goals = sequelize.define(
    'goals',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.TEXT,
      },

      award: {
        type: DataTypes.TEXT,
      },

      start_date: {
        type: DataTypes.DATE,
      },

      end_date: {
        type: DataTypes.DATE,
      },

      reason: {
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

  goals.associate = (db) => {
    db.goals.belongsTo(db.goal_categories, {
      as: 'category',
      foreignKey: {
        name: 'categoryId',
      },
      constraints: false,
    });

    db.goals.belongsTo(db.users, {
      as: 'author',
      foreignKey: {
        name: 'authorId',
      },
      constraints: false,
    });

    db.goals.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.goals.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return goals;
};
