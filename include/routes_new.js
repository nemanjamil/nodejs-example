const express = require("express");
const router = express.Router();

// get model article
let Article  = require('../models/article');

router.get('/add', (req, res) => {
    res.render('add_article', {
        title: 'Article'
    })
})

module.exports = router;