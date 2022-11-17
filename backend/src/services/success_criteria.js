const db = require('../db/models');
const Success_criteriaDBApi = require('../db/api/success_criteria');

module.exports = class Success_criteriaService {
  static async create(data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      await Success_criteriaDBApi.create(data, {
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
      let success_criteria = await Success_criteriaDBApi.findBy(
        { id },
        { transaction },
      );

      if (!success_criteria) {
        throw new ValidationError('success_criteriaNotFound');
      }

      await Success_criteriaDBApi.update(id, data, {
        currentUser,
        transaction,
      });

      await transaction.commit();
      return success_criteria;
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

      await Success_criteriaDBApi.remove(id, {
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
