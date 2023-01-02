const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const accountability_groups = sequelize.define(
    'accountability_groups',
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

  accountability_groups.associate = (db) => {
    db.accountability_groups.belongsToMany(db.users, {
      as: 'users',
      foreignKey: {
        name: 'userId',
      },
      constraints: false,
      through: 'accountability_groupsUsersUsers',
    });

    db.accountability_groups.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.accountability_groups.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return accountability_groups;
};
