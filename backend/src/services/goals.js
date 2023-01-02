const db = require('../db/models');
const GoalsDBApi = require('../db/api/goals');
const UsersDBApi = require('../db/api/users');
const Goal_categoriesDBApi = require('../db/api/goal_categories');
const Success_criteriaDBApi = require('../db/api/success_criteria')

module.exports = class GoalsService {
  static async create(data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      const user = await UsersDBApi.findBy({ email: data.author });
      const goalCategory = await Goal_categoriesDBApi.findBy({name: data.goalCategory.name}, {transaction})

      const goal = await GoalsDBApi.create(data, {
        user,
        transaction,
        goalCategory,
      });
      await Success_criteriaDBApi.create(data.successCriteria,{
        user,
        goal,
        transaction,
      })
      
      await transaction.commit();
      return goal
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  static async update(data, id, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      let goals = await GoalsDBApi.findBy({ id }, { transaction });
      const goalCategory = await Goal_categoriesDBApi.findBy({name: data.goalCategory.name})

      if (!goals) {
        throw new ValidationError('goalsNotFound');
      }

      await GoalsDBApi.update(id, data, {
        currentUser,
        transaction,
        goalCategory
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
      // if (currentUser.role !== 'admin') {
      //   throw new ValidationError('errors.forbidden.message');
      // }

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
