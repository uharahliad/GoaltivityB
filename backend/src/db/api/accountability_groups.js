const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');
const twilio = require('twilio')
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const uuid = require('uuid')

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Accountability_groupsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    console.log(data)

    const accountability_groups = await db.accountability_groups.create(
      {
        id: undefined,

        name: data.name || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );
    await Promise.all(options.allUsers.map(async user => await accountability_groups.setUsers(user.id, {
      transaction,
    })));

    await client.conversations.v1.conversations.create({friendlyName: data.name, uniqueName: data.name})

    return accountability_groups;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const accountability_groups = await db.accountability_groups.findByPk(id, {
      transaction,
    });

    await accountability_groups.update(
      {
        name: data.name || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await accountability_groups.setUsers(data.users || [], {
      transaction,
    });

    return accountability_groups;
  }

  static async addUserToGroup(user, group) {
    const transaction = await db.sequelize.transaction();
    
    const accountability_group = await db.accountability_groups.findOne(
      { where: {name: group}, include: {association: 'users'} },
      { transaction },
      );
    await db.sequelize.query(`INSERT INTO "accountability_groupsUsersUsers" ("createdAt","updatedAt","userId","accountability_group","id") VALUES ('${(new Date()).toLocaleDateString()}','${(new Date()).toLocaleDateString()}','${user.id}','${accountability_group.dataValues.id}','${uuid.v4()}') RETURNING "createdAt","updatedAt","userId","accountability_group","id"`);
    const conversation = await client.conversations.v1.conversations(accountability_group.name).fetch()
    if (conversation) {
      const participants = await client.conversations.v1.conversations(accountability_group.name).participants.list()
      if (participants.length !== 0) {
        await client.conversations.v1.conversations(accountability_group.name).participants.create({identity: user.email})
      } else {
        const groupUsers = await db.sequelize.query(`SELECT email FROM "users" LEFT JOIN "accountability_groupsUsersUsers" ON "accountability_groupsUsersUsers"."userId" = "users"."id"`)
        console.log(groupUsers[0])
        await Promise.all(groupUsers[0].map(async item => await client.conversations.v1.conversations(accountability_group.name).participants.create({identity: item.email})))
      }
    }
    return accountability_group;
  }

  static async addUsersToGroup(users, group) {
    const transaction = await db.sequelize.transaction();
    
    const accountability_group = await db.accountability_groups.findOne(
      { where: {name: group}, include: {association: 'users'} },
      { transaction },
      );
    await Promise.all(users.map(async user => await db.sequelize.query(`INSERT INTO "accountability_groupsUsersUsers" ("createdAt","updatedAt","userId","accountability_group") VALUES ('${(new Date()).toLocaleDateString()}','${(new Date()).toLocaleDateString()}','${user}','${accountability_group.dataValues.id}') RETURNING "createdAt","updatedAt","userId","accountability_group"`)))
    const conversation = await client.conversations.v1.conversations(accountability_group.name).fetch()
    if (conversation) {
      await Promise.all(users.map(async user => await client.conversations.v1.conversations(accountability_group.name).participants.create({identity: user.email})))
    } else {
      return 'no conversation'
    }
    return accountability_group;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const accountability_groups = await db.accountability_groups.findByPk(
      id,
      options,
    );

    await accountability_groups.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await accountability_groups.destroy({
      transaction,
    });

    return accountability_groups;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const accountability_groups = await db.accountability_groups.findOne(
      { where },
      { transaction },
    );

    if (!accountability_groups) {
      return accountability_groups;
    }

    const output = accountability_groups.get({ plain: true });

    output.users = await accountability_groups.getUsers({
      transaction,
    });

    return output;
  }

  static async findAllByUserId(userId) {
    const transaction = await db.sequelize.transaction();
    
    const accountability_groups = await db.sequelize.query(`SELECT * from "accountability_groups"
    LEFT JOIN "accountability_groupsUsersUsers" ON "accountability_groupsUsersUsers"."accountability_group" = "accountability_groups"."id"
    WHERE "accountability_groupsUsersUsers"."userId" = '${userId}'
    `)
    const accountability_groupsData = await Promise.all(accountability_groups[0].map(async group => {
      const users = await db.sequelize.query(`SELECT "userId","firstName","email" from "accountability_groupsUsersUsers" LEFT JOIN "users" ON "users"."id" = "accountability_groupsUsersUsers"."userId" WHERE "accountability_groupsUsersUsers"."accountability_group" = '${group.accountability_group}'`)
      return {group, users}
    }))

    return accountability_groupsData
  }

  static async findAll(filter, options) {
    var limit = filter.limit || 0;
    var offset = 0;
    const currentPage = +filter.page;
    console.log(filter)

    offset = currentPage * limit;

    var orderBy = null;

    const transaction = (options && options.transaction) || undefined;
    let where = {};
    let include = [
      {
        model: db.users,
        as: 'users',
        through: 'accountability_groupsUsersUsers',
        where: {id: filter.user.accountability_groups_usersId},
        // through: filter.users
        //   ? {
        //       where: {
        //         [Op.or]: filter.users.split('|').map((item) => {
        //           return { ['Id']: Utils.uuid(item) };
        //         }),
        //       },
        //     }
        //   : null,
        // required: filter.users ? true : null,
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
          [Op.and]: Utils.ilike('accountability_groups', 'name', filter.name),
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

    let { rows, count } = await db.accountability_groups.findAndCountAll({
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
    console.log(rows)
      //  rows = await this._fillWithRelationsAndFilesForRows(
      //    rows,
      //    options,
      //  );

    return { rows, count };
  }

  static async findAllAutocomplete(query, limit) {
    let where = {};

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('accountability_groups', 'name', query),
        ],
      };
    }

    const records = await db.accountability_groups.findAll({
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
