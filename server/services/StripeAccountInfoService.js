const { ApplicationError } = require('../lib/Error');

/**
 * Logic for interacting with the stripe express account model
 */
class StripeAccountInfoService {
  /**
   * Constructor
   * @param {*} stripe pass in stripe express account model
   */
  constructor(StripeAccountInfoModel) {
    this.StripeAccountInfoModel = StripeAccountInfoModel;
  }

  static isAccountFeeDue(account) {
    return account.accountFees && account.accountFees.due
      ? account.accountFees.due < Date.now()
      : true;
  }

  async isAccountFeeDue(userId) {
    let account;

    try {
      account = await this.StripeAccountInfoModel.findOne({
        user: userId,
      });
    } catch (err) {
      throw new ApplicationError({ err }, `Internal error finding Stripe Account Info.`);
    }
    return account.accountFees.accountFeeDueDue < Date.now();
  }

  async getAccountByUser(userId) {
    let account;

    try {
      account = await this.StripeAccountInfoModel.findOne({
        user: userId,
      });
    } catch (err) {
      throw new ApplicationError(
        { err },
        `Internal error when trying to find Stripe Express Account Info.`
      );
    }
    return account;
  }

  async createAccount(accountInfo) {
    let account;

    try {
      account = await this.StripeAccountInfoModel.create(accountInfo);
    } catch (err) {
      throw new ApplicationError(
        { err },
        `Stripe Express Account Info not created. Internal error.`
      );
    }
    return account;
  }

  async deleteAccount(id) {
    try {
      const deleted = await this.StripeAccountInfoModel.deleteOne({
        _id: id,
      });
      return;
    } catch (err) {
      throw new ApplicationError(
        { err },
        `Stripe Express Account Info could not be deleted because of an internal error.`
      );
    }
  }
}

module.exports = StripeAccountInfoService;
