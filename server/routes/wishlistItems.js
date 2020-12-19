const express = require('express');
const passport = require('passport');
const WishlistItemModel = require('../models/WishlistItem.Model');
const WishlistItemService = require('../services/WishlistItemService');
const WishlistModel = require('../models/Wishlist.Model');
const WishlistService = require('../services/WishlistService');
const logger = require('../lib/logger');
const { ApplicationError } = require('../lib/Error');
const wishlists = require('./wishlists');
const middlewares = require('./middlewares');
const ImageService = require('../services/ImageService');

const profileImageDirectory = `${__dirname}/../public/data/images/itemImages`;
const imageService = new ImageService(profileImageDirectory);

const wishlistItemRoutes = express.Router();
const wishlistItemService = new WishlistItemService(WishlistItemModel);
const wishlistService = new WishlistService(WishlistModel);

async function throwIfNotAuthorizedResource(req, res, next) {
  // change this to check that wishlist is in user wishlist array
  logger.log('silly', `authorizing user owns resource...`);
  if (!req.user) {
    return next(new ApplicationError({}, `Not Authorized.`));
  }
  if (req.method === 'POST') {
    let wishlist;
    try {
      wishlist = await wishlistService.getWishlist(req.body.wishlist);
    } catch (err) {
      next(err);
    }
    if (!wishlist) return next(new ApplicationError({}, `Couldn't find wishlist`)); // throw from getAlias?
    // should authorize that owner of alias is req.user
    if (wishlist.user.toString() !== req.user.toString) {
      return next(
        new ApplicationError(
          { currentUser: req.user._id, owner: wishlist.user },
          `Not Authorized. Cannot add wishlistItem to wishlist that doesn't belong to logged in user. User:${req.user._id}. Owner: ${wishlist.user}`
        )
      );
    }
  }
  if (req.method === 'PUT' || req.method === 'DELETE') {
    let wishlistItem;
    try {
      wishlistItem = await wishlistItemService.getWishlistItem(req.params.id);
    } catch (err) {
      next(err);
    }
    if (!wishlistItem)
      return next(new ApplicationError({}, `No wishlist item found. id: ${req.params.id}`));
    // should authorize that user of wishlistItem is req.user
    if (wishlistItem.user.toString() !== req.user._id.toString()) {
      return next(
        new ApplicationError(
          { currentUser: req.user._id, owner: wishlistItem.user },
          `Not Authorized. WishlistItem doesn't belong to logged in user. User:${req.user._id}. Owner: ${wishlistItem.user}`
        )
      );
    }
  }

  return next();
}

module.exports = () => {
  wishlistItemRoutes.post(
    '/',
    throwIfNotAuthorizedResource,
    middlewares.cropImage({ h: 300, w: 300 }),
    middlewares.handleImage(imageService, { h: 300, w: 300 }),
    async (req, res, next) => {
      logger.log('silly', `creating new wishlist item`);
      try {
        const imageFile = req.file && req.file.storedFilename;
        const itemInfo = { ...req.body };
        if (imageFile) itemInfo.itemImage = `/data/images/itemImages/${imageFile}`;
        delete itemInfo.imageCrop;
        await wishlistItemService.addWishlistItem(itemInfo);
        //if image uploaded succefully, delete old image
      } catch (err) {
        if (req.file && req.file.storedFilename) {
          await imageService.delete(req.file.storedFilename);
        }
        logger.log('silly', `wishlist item could not be added`);
        return next(
          new ApplicationError({ err, body: req.body }, `wishlist item could not be added: ${err}`)
        );
      }
      return res.send(200);
    }
  );

  wishlistItemRoutes.patch(
    '/:id',
    throwIfNotAuthorizedResource,
    middlewares.upload.single('image'),
    // middlewares.upload.any(),
    middlewares.handleImage(imageService, { h: 300, w: 300 }),
    async (req, res, next) => {
      try {
        const imageFile = req.file && req.file.storedFilename;
        const patch = { ...req.body };
        if (imageFile) patch.coverImage = `/data/images/itemImages/${imageFile}`;
        await wishlistItemService.updateWishlistItem(req.params.id, patch);
      } catch (err) {
        if (req.file && req.file.storedFilename) {
          await imageService.delete(req.file.storedFilename);
        }
        logger.log('silly', `wishlist item could not be updated ${err}`);
        return next(
          new ApplicationError(
            { err, body: req.body }`wishlist item could not be updated ${req.body}: ${err}`
          )
        );
      }
      return res.sendStatus(200);
    }
  );
  // wishlistItemRoutes.post('/', throwIfNotAuthorizedResource, async (req, res, next) => {
  //   logger.log('silly', `creating wishlistItem`);

  //   let wishlistItem;
  //   const values = { ...req.body };
  //   delete values.wishlist;

  //   try {
  //     wishlistItem = await wishlistItemService.addWishlistItem(req.body.wishlist, values);
  //   } catch (err) {
  //     return next(err);
  //   }
  //   logger.log('silly', `wishlistItem created`);
  //   return res.json(wishlistItem);
  // });

  wishlistItemRoutes.put('/:id', throwIfNotAuthorizedResource, async (req, res, next) => {
    logger.log('silly', `updating wishlistItem by id`);
    const { id } = req.params;

    const updates = req.body;
    if (updates.user || updates._id)
      return next(new ApplicationError({}, `No user or id updates allowed from this route.`));
    let wishlistItem;
    try {
      wishlistItem = await wishlistItemService.updateWishlistItem(id, updates);
    } catch (err) {
      return next(err);
    }
    return res.json(wishlistItem);
  });

  wishlistItemRoutes.delete('/:id', throwIfNotAuthorizedResource, async (req, res, next) => {
    logger.log('silly', `deleting wishlist item by id`);
    const { id } = req.params;
    let wishlistItem;
    try {
      wishlistItem = await wishlistItemService.deleteWishlistItem(id);
      //need to delete image
    } catch (err) {
      return next(err);
    }
    return res.sendStatus(204);
  });

  return wishlistItemRoutes;
};
