const db = require('../db/models');
const UsersDBApi = require('../db/api/users');

const InvitationEmail = require('./email/list/invitation');
const ValidationError = require('./notifications/errors/validation');
const EmailSender = require('./email');
const AuthService = require('./auth');
const FileDBApi = require('../db/api/file');
const uuid = require('uuid')

module.exports = class UsersService {
  static async create(data, currentUser, sendInvitationEmails = true, host) {
    let transaction = await db.sequelize.transaction();
    let email = data.email;
    let emailsToInvite = [];
    try {
      if (email) {
        let user = await UsersDBApi.findBy({ email }, { transaction });
        if (user) {
          throw new ValidationError('iam.errors.userAlreadyExists');
        } else {
          await UsersDBApi.create(
            { data },
            {
              currentUser,
              transaction,
            },
          );
          emailsToInvite.push(email);
        }
      }
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
    if (emailsToInvite && emailsToInvite.length) {
      if (!sendInvitationEmails) {
        return;
      }
      AuthService.sendPasswordResetEmail(email, 'invitation', host);
    }
  }

  static async update(data, email, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      console.log(email)
      let user = await db.users.findOne({ where:{email: email} });
      let file = await db.file.findOne({where: {belongsToId: user.id}})
      console.log(user.dataValues)
      if (!user) {
        throw new ValidationError('iam.errors.userNotFound');
      }
      await user.update({
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        phoneNumber: data.phoneNumber || null,
        email: data.email || null,
        bio: data.bio || null,
      },{ transaction })
      // await UsersDBApi.update(user.id, data, {
      //   currentUser,
      //   transaction,
      // });
      let image = ''
      if (data.avatar && !file) {
        const insertedImage = await db.sequelize.query(`INSERT INTO "files" ("id","belongsTo","belongsToColumn","belongsToId","publicUrl","createdAt","updatedAt","name") VALUES ('${uuid.v4()}','users','avatar','${user.id}','${data.avatar}','${(new Date()).toLocaleDateString()}','${(new Date()).toLocaleDateString()}','profile_picture') RETURNING "files"."publicUrl"`)
        image = insertedImage.publicUrl
      } else if (data.avatar && file) {
        await file.update({
          publicUrl: data.avatar,
        })
        image = file.publicUrl
      } else {
        image = file.publicUrl
      }
      await user.save()

      await transaction.commit();
      return {...user.dataValues, image};
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async remove(email, currentUser) {
    const transaction = await db.sequelize.transaction();

    try {
      // if (currentUser.id === id) {
      //   throw new ValidationError('iam.errors.deletingHimself');
      // }

      // if (currentUser.role !== 'admin') {
      //   throw new ValidationError('errors.forbidden.message');
      // }

      await UsersDBApi.remove(email, {
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
