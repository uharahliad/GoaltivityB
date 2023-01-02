'use strict';

const ids = [
  '98eed488-b6bf-4213-92e2-1097e4349a8f',
  '86828200-a839-455b-bd50-0a6803e27517',
  'd8a55b98-c830-4b3c-bb7f-73c3c248372b'
]

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const sequelize = queryInterface.sequelize;
    const userIds = await sequelize.query('SELECT id FROM users', { type: sequelize.QueryTypes.SELECT})
    await queryInterface.bulkInsert('accountability_groups', [{
        id: '74cc77cb-24b7-4991-9403-f0933e4e735e',
        name: 'AllUsersGroup',
        importHash: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    }])
    return await Promise.all(userIds.map((item, i) => queryInterface.bulkInsert('accountability_groupsUsersUsers', [{
      id: ids[i],
      userId: item.id,
      accountability_group: '74cc77cb-24b7-4991-9403-f0933e4e735e',
    }])))
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
