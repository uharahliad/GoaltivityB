'use strict';

const goalsIds = [
  'f2a4e48f-a9e6-41ca-81f9-7ca079023d06',
  '3c1278d2-e6fc-47ff-baa1-6fcbf5a7da7c',
  '6032506c-d592-4e7c-80eb-1b1d6dc7b3d2',
  '7def5263-4fc0-4b38-8de4-2cfa5a588676',
  '4e536f70-23e4-4b7a-9e39-8d5624d8d130',
]

const categories = [
  'Career/Business',
  'Family & Relationships',
  'Personal Growth',
  'Health',
  'Recreation/Leisure',
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('goal_categories', [
      {
        id: goalsIds[0],
        name: categories[0],
        importHash: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: goalsIds[1],
        name: categories[1],
        importHash: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: goalsIds[2],
        name: categories[2],
        importHash: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: goalsIds[3],
        name: categories[3],
        importHash: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: goalsIds[4],
        name: categories[4],
        importHash: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(
      'goal_categories',
      {
        id: {
          [Sequelize.Op.in]: goalsIds,
        },
      },
      {},
    );
  }
};
