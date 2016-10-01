const express = require('express'),
      router = express.Router();

router.get('/:section', function (req, res) {
    var section = req.params.section;
    var template = `partials/admin/${section}`;
    res.render(template);
});

module.exports = router;