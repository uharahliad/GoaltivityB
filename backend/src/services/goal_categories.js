const db = require('../db/models');
const Goal_categoriesDBApi = require('../db/api/goal_categories');

module.exports = class Goal_categoriesService {
  static async create(data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      await Goal_categoriesDBApi.create(data, {
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
      let goal_categories = await Goal_categoriesDBApi.findBy(
        { id },
        { transaction },
      );

      if (!goal_categories) {
        throw new ValidationError('goal_categoriesNotFound');
      }

      await Goal_categoriesDBApi.update(id, data, {
        currentUser,
        transaction,
      });

      await transaction.commit();
      return goal_categories;
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

      await Goal_categoriesDBApi.remove(id, {
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
