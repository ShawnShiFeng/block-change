const express = require('express');

const router = express.Router();
const Promise = require('bluebird');
const models = require('../../db/models');
const helpers = require('../../ethereum/helpers');
const db = require('../../db');


router.route('/create')
.post((req, res) => {
  console.log('req.body: create project: ', req.body);
  models.Wallets.where({profile_id: -1}).fetch()
  .then(wallet => {
    req.body.project_wallet = wallet.attributes.wallet_address;
    wallet.set({profile_id: req.body.profile_id}).save();
    models.Project.forge(req.body).save()
    .then((project) => {
      res.status(201).send(project.serialize());
    })
    .catch((err) => {
      console.log(err)
      res.sendStatus(500);
    });
  });
});

router.route('/fetchProjects')
.get((req, res) => {
  db.knex.select().from('projects')
  .then((data) => {
    res.send(data);
  })
  .catch((err) => { console.log(err); });
});

router.route('/getBalance/:address')
.get((req, res) => {
  return new Promise((resolve, reject) => {
    resolve(helpers.getBalance(req.params.address));
  })
    .then((data) => {
      res.status(200).send({ balance: data });
    })
    .catch((err) => { console.log(err); });
});

router.route('/sendTransaction')
.post((req, res) => {
  return new Promise((resolve, reject) => {
    const { amount, fromAddress, toAddress } = req.body;
    resolve(helpers.sendTransaction(amount, fromAddress, toAddress));
  })
  .then((data) => {
    models.Donation.forge({ project_id: req.body.project_id, profile_id: req.body.profile_id, txhash: data }).save()
    res.status(200).send({ txHash: data });
  })
  .catch((err) => { console.log(err); });
});

// 0xc960015f7ba0029847dab2c6213528d5eb1861721f897a8141c822b9de6db1bb
router.route('/getTransaction/:txHash')
.get((req, res) => {
  return new Promise((resolve, reject) => {
    resolve(helpers.getTransaction(req.params.txHash));
  })
  .then((data) => {
    res.status(200).send({ data });
  })
  .catch((err) => { console.log(err); });
});

router.route('/getDonations')
.post((req, res) => {
  models.Donation.where({ project_id: req.body.project_id }).fetchAll()
  .then((project) => {
    res.status(201).send(project.serialize().map(x => x.txhash));
  })
  .catch((err) => {
    res.status(500).send(err);
  });
});

router.route('/getTxDonations')
.post((req, res) => {
  models.Donation.where({ project_id: req.body.project_id }).fetchAll()
    .then((project) => {
    res.status(201).send(project.serialize().map(x => helpers.getTransaction(x.txhash)));
  })
  .catch((err) => {
    res.status(500).send(err);
  });
});

module.exports = router;
