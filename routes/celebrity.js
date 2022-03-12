const express = require('express');

const router = express.Router();

//  /celebrity index route
router.get('/*', (req, res) => {
    res.render('celebrity');
});

module.exports = router;
