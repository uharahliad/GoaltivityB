const db = require('../db/models');
const GoalsDBApi = require('../db/api/goals');

module.exports = class GoalsService {
  static async create(data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      await GoalsDBApi.create(data, {
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
      let goals = await GoalsDBApi.findBy({ id }, { transaction });

      if (!goals) {
        throw new ValidationError('goalsNotFound');
      }

      await GoalsDBApi.update(id, data, {
        currentUser,
        transaction,
      });

      await transaction.commit();
      return goals;
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

      await GoalsDBApi.remove(id, {
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
