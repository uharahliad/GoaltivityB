const db = require('../db/models');
const Accountability_groupsDBApi = require('../db/api/accountability_groups');
const UsersDBApi = require('../db/api/users');
const { Op } = require("sequelize");

module.exports = class Accountability_groupsService {
  // static async create(data, currentUser) {
  //   const transaction = await db.sequelize.transaction();
  //   try {
  //     await Accountability_groupsDBApi.create(data, {
  //       currentUser,
  //       transaction,
  //     });

  //     await transaction.commit();
  //   } catch (error) {
  //     await transaction.rollback();
  //     throw error;
  //   }
  // }
  static async create(data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      const allUsers = await UsersDBApi.findAll([])
      await Accountability_groupsDBApi.create(data, {
        currentUser,
        transaction,
        allUsers: allUsers.rows
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  static async update(data, id, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      let accountability_groups = await Accountability_groupsDBApi.findBy(
        { id },
        { transaction },
      );
      const users = await Promise.all(data.users.map(async userItem => await UsersDBApi.findBy({id: userItem.id})))

      if (!accountability_groups) {
        throw new ValidationError('accountability_groupsNotFound');
      }

      await Accountability_groupsDBApi.addUsersToGroup(users, id);

      await transaction.commit();
      return accountability_groups;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async remove(id, currentUser) {
    const transaction = await db.sequelize.transaction();

    try {
      if (currentUser.role !== 'admin') {
        throw new ValidationError('errors.forbidden.message');
      }

      await Accountability_groupsDBApi.remove(id, {
        currentUser,
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
