const UserModel = require('../models/User.Model');
const AliasModel = require('../models/Alias.Model');
const { ApplicationError } = require('../lib/Error');
/**
 * Logic for Alias
 */
class AliasService {
  /**
   * Constructor
   * @param {*} AliasModel Mongoose Schema Model
   */
  constructor(AliasModel) {
    this.AliasModel = AliasModel;
  }

  /**
   * creates an alias and adds the id
   * to the specified user-alias's "alias"
   * @param {string} userId
   * @param {object} aliasValues the values for the alias besides user and alias
   *
   *
   * @returns {object} the alias
   */
  async addAlias(userId, aliasValues) {
    let newAlias;
    let user;
    const alias = aliasValues;
    alias.user = userId;
    try {
      user = await UserModel.findById(userId);
    } catch (err) {
      throw new ApplicationError(
        { userId, aliasValues, err },
        `Not able to add alias. User Id not found. ${err.message}`
      );
    }

    try {
      newAlias = await this.AliasModel.create(alias);
    } catch (err) {
      throw new ApplicationError(
        { userId, aliasId, alias, err },
        `Not able to add alias. Alias not able to be created. ${err.message}`
      );
    }

    user.aliases.push({ _id: newAlias._id });
    await user.save();

    return newAlias;
  }

  /**
   * gets a alias
   * @param {string} id the alias id
   *
   *
   * @returns {object} the alias
   */
  async getAlias(id) {
    let alias;
    try {
      alias = await this.AliasModel.findById(id);
    } catch (err) {
      throw new ApplicationError({ id, err }, `Alias not found.`);
    }

    return alias;
  }

  /**
   * update a alias
   * @param {string} id the alias id to update
   * @param {object} updates the updates to the alias {property: value}
   *
   *
   * @returns {object} the updated alias
   */
  async updateAlias(id, updates) {
    const output = await this.AliasModel.updateOne({ _id: id }, updates);
    let updatedAlias;
    if (output.nModified) {
      updatedAlias = await this.getAlias(id);
    } else {
      throw new ApplicationError({ id, updates }, 'Alias not updated.');
    }

    return updatedAlias;
  }

  /**
   * delete an alias
   * @param {string} id the id of the alias to delete
   *
   *
   * @returns {object} the deleted alias
   */
  async deleteAlias(id) {
    let alias;
    try {
      alias = await this.AliasModel.findById(id);
    } catch (err) {
      throw new ApplicationError({ id, err }, `Couldn't delete alias. Alias not found.`);
    }
    await alias.remove();
    return alias;
  }
}

module.exports = AliasService;