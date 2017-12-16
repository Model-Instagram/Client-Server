const express = require('express');

const router = express.Router();

const elastic = require('../elasticsearch');

/* GET suggestions */
router.get('/suggest/:input', (req, res, next) => {
  elastic.getSuggestions(req.params.input)
    .then((result) => {
      res.json(result);
    });
});

/* POST document to be indexed */
router.post('/', (req, res, next) => {
  elastic.addDocument(req.body)
    .then((result) => {
      res.json(result);
    });
});

module.exports = router;
