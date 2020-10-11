const express = require('express');
const router = express.Router();

const db = require('../models');

router.get('/', (req, res) => {
  db.Realtor.find({}, (err, allRealtors) => {
    if (err) return console.log(err);

    res.render('realtors/index', {allRealtors});
  });
});

router.get('/new', (req, res) => {
  res.render('realtors/new')
});

router.post('/', (req, res) => {
  db.Realtor.create(req.body, (err, newRealtor) => {
    if (err) console.log(err);

    res.redirect('/realtors');
  });
});

router.get('/:realtorId', (req, res) => {
  db.Realtor.find(req.params.realtorId)
    .populate('houses')
    .exec((err, foundRealtor) => {
      if (err) console.log(err);

      console.log(foundRealtor);

      res.render('realtors/show', {realtor: foundRealtor});
    });
});

router.get('/:realtorId/edit', (req, res) => {
  db.Realtor.findById(req.params.realtorId, (err, foundRealtor) => {
    if (err) console.log(err);

    res.render('realtors/edit', {foundRealtor});
  });
});

router.put('/:realtorId', (req, res) => {
  db.Realtor.findByIdAndUpdate(
    req.params.realtorId,
    req.body,
    {new: true},
    (err, updatedRealtor) => {
    if (err) console.log(err);

    res.redirect(`/realtors/${updatedRealtor._id}`);
  });
});

module.exports = router;