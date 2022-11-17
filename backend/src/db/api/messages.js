const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class MessagesDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const messages = await db.messages.create(
      {
        id: data.id || undefined,

        text: data.text || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await messages.setAuthor(data.author || null, {
      transaction,
    });

    await messages.setGroup(data.group || null, {
      transaction,
    });

    return messages;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const messages = await db.messages.findByPk(id, {
      transaction,
    });

    await messages.update(
      {
        text: data.text || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await messages.setAuthor(data.author || null, {
      transaction,
    });

    await messages.setGroup(data.group || null, {
      transaction,
    });

    return messages;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const messages = await db.messages.findByPk(id, options);

    await messages.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await messages.destroy({
      transaction,
    });

    return messages;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const messages = await db.messages.findOne({ where }, { transaction });

    if (!messages) {
      return messages;
    }

    const output = messages.get({ plain: true });

    output.author = await messages.getAuthor({
      transaction,
    });

    output.group = await messages.getGroup({
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
        model: db.users,
        as: 'author',
      },

      {
        model: db.accountability_groups,
        as: 'group',
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.text) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('messages', 'text', filter.text),
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

      if (filter.author) {
        var listItems = filter.author.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          authorId: { [Op.or]: listItems },
        };
      }

      if (filter.group) {
        var listItems = filter.group.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          groupId: { [Op.or]: listItems },
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

    let { rows, count } = await db.messages.findAndCountAll({
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
          Utils.ilike('messages', 'id', query),
        ],
      };
    }

    const records = await db.messages.findAll({
      attributes: ['id', 'id'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['id', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.id,
    }));
  }
};
