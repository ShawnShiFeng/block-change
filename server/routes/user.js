const express = require('express');

const router = express.Router();
const models = require('../../db/models');
const ether = require('../../ethereum/helpers/index');

router.route('/login')
.post((req, res) => {
  models.User.where({ email: req.body.email }).fetch()
  .then((user) => {
    res.status(201).send(user.serialize());
  })
  .catch((err) => {
    res.status(500).send(err);
  });
});

router.route('/signup')
.post((req, res) => {
  models.Wallets.where({ profile_id: -1 }).fetch()
  .then((wallet) => {
    req.body.profile_wallet = wallet.attributes.wallet_address;
    models.User.forge(req.body).save()
    .then(user => {
      wallet.set({ profile_id: user.attributes.id }).save();
      user.set({ profile_wallet: wallet.attributes.wallet_address }).save();
      // fund the user ethereum wallet with the amout this particular used inputed
      ether.fundFromMint(req.body.debit, wallet.attributes.wallet_address);
      res.status(201).send(user.serialize());
    });
  })
  .catch((err) => {
    res.status(500).send(err);
  });
});

module.exports = router;
