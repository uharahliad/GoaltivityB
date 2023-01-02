const db = require('../db/models');
const Action_itemsDBApi = require('../db/api/action_items');

module.exports = class Action_itemsService {
  static async create(data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      await Action_itemsDBApi.create(data, {
        currentUser,
        transaction,
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
      let action_items = await Action_itemsDBApi.findBy(
        { id },
        { transaction },
      );

      if (!action_items) {
        throw new ValidationError('action_itemsNotFound');
      }

      await Action_itemsDBApi.update(id, data, {
        currentUser,
        transaction,
      });

      await transaction.commit();
      return action_items;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async remove(id, currentUser) {
    const transaction = await db.sequelize.transaction();

    try {
      // if (currentUser.role !== 'admin') {
      //   throw new ValidationError('errors.forbidden.message');
      // }

      await Action_itemsDBApi.remove(id, {
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
