const mongoose = require('mongoose');
const softDelete = require('mongoosejs-soft-delete');
const mongoose_delete = require('mongoose-delete');

const { ApplicationError } = require('../lib/Error');

const stripeInfoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    stripeAccountId: { type: String, required: true },
    activated: { type: Boolean, required: true },
    // detailsSubmitted: { type: Boolean, required: true },
    currency: { type: String },
    country: { type: String },
    // accountFees: {
    //   due: { type: Date },
    //   lastAccountFeePaid: { type: Date },
    //   accountFeesPaid: [{ type: Date }],
    // },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.user;
      },
    },
  },
  { timestamps: { createdAt: 'created_at' } }
);

stripeInfoSchema.path('user').validate(async function (value) {
  const UserModel = require('./User.Model');
  const user = await UserModel.findOne({ _id: value });
  if (!user) {
    throw new Error(
      `Invalid "user" property for  Stripe Account Information schema. No user found with id: ${value}`
    );
  } else {
    return true;
  }
}, 'Parent User non existent');
// stripeInfoSchema.plugin(softDelete);
stripeInfoSchema.plugin(mongoose_delete, {
  indexFields: ['deletedAt'],
  overrideMethods: 'all',
  validateBeforeDelete: false,
});

const StripeAccountInfo = mongoose.model('StripeAccountInfo', stripeInfoSchema);
module.exports = StripeAccountInfo;
