const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const success_criteria = sequelize.define(
    'success_criteria',
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

  success_criteria.associate = (db) => {
    db.success_criteria.belongsTo(db.goals, {
      as: 'goal',
      foreignKey: {
        name: 'goalId',
      },
      constraints: false,
    });

    db.success_criteria.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.success_criteria.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return success_criteria;
};
