const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Action_itemsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const action_items = await db.action_items.create(
      {
        id: data.id || undefined,

        name: data.name || null,
        status: data.status || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await action_items.setGoal(data.goal || null, {
      transaction,
    });

    return action_items;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const action_items = await db.action_items.findByPk(id, {
      transaction,
    });

    await action_items.update(
      {
        name: data.name || null,
        status: data.status || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await action_items.setGoal(data.goal || null, {
      transaction,
    });

    return action_items;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const action_items = await db.action_items.findByPk(id, options);

    await action_items.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await action_items.destroy({
      transaction,
    });

    return action_items;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const action_items = await db.action_items.findOne(
      { where },
      { transaction },
    );

    if (!action_items) {
      return action_items;
    }

    const output = action_items.get({ plain: true });

    output.goal = await action_items.getGoal({
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
        model: db.goals,
        as: 'goal',
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
          [Op.and]: Utils.ilike('action_items', 'name', filter.name),
        };
      }

      if (filter.status) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('action_items', 'status', filter.status),
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

      if (filter.goal) {
        var listItems = filter.goal.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          goalId: { [Op.or]: listItems },
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

    let { rows, count } = await db.action_items.findAndCountAll({
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
          Utils.ilike('action_items', 'name', query),
        ],
      };
    }

    const records = await db.action_items.findAll({
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
