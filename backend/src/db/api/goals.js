const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class GoalsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const goals = await db.goals.create(
      {
        id: data.id || undefined,

        name: data.name || null,
        award: data.award || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await goals.setCategory(data.category || null, {
      transaction,
    });

    await goals.setAuthor(data.author || null, {
      transaction,
    });

    return goals;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const goals = await db.goals.findByPk(id, {
      transaction,
    });

    await goals.update(
      {
        name: data.name || null,
        award: data.award || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await goals.setCategory(data.category || null, {
      transaction,
    });

    await goals.setAuthor(data.author || null, {
      transaction,
    });

    return goals;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const goals = await db.goals.findByPk(id, options);

    await goals.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await goals.destroy({
      transaction,
    });

    return goals;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const goals = await db.goals.findOne({ where }, { transaction });

    if (!goals) {
      return goals;
    }

    const output = goals.get({ plain: true });

    output.category = await goals.getCategory({
      transaction,
    });

    output.author = await goals.getAuthor({
      transaction,
    });

    return output;
  }

  static async findAll(filter, options) {
    var limit = filter.limit || 0;
    var offset = 0;
    const currentPage = +filter.page;

    offset = currentPage * limit;

    var orderBy = null;

    const transaction = (options && options.transaction) || undefined;
    let where = {};
    let include = [
      {
        model: db.goal_categories,
        as: 'category',
      },

      {
        model: db.users,
        as: 'author',
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('goals', 'name', filter.name),
        };
      }

      if (filter.award) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('goals', 'award', filter.award),
        };
      }

      if (
        filter.active === true ||
        filter.active === 'true' ||
        filter.active === false ||
        filter.active === 'false'
      ) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.category) {
        var listItems = filter.category.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          categoryId: { [Op.or]: listItems },
        };
      }

      if (filter.author) {
        var listItems = filter.author.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          authorId: { [Op.or]: listItems },
        };
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.lte]: end,
            },
          };
        }
      }
    }

    let { rows, count } = await db.goals.findAndCountAll({
      where,
      include,
      distinct: true,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      order:
        filter.field && filter.sort
          ? [[filter.field, filter.sort]]
          : [['createdAt', 'desc']],
      transaction,
    });

    //    rows = await this._fillWithRelationsAndFilesForRows(
    //      rows,
    //      options,
    //    );

    return { rows, count };
  }

  static async findAllAutocomplete(query, limit) {
    let where = {};

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('goals', 'name', query),
        ],
      };
    }

    const records = await db.goals.findAll({
      attributes: ['id', 'name'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['name', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.name,
    }));
  }
};
