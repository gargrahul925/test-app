const router = require('express').Router();
const taskApis = require('./tasks');

const { Authenticate } = require('./../../lib/middlewares');

router.get('/:id', Authenticate.authenticate, taskApis.get);
router.get('/', Authenticate.authenticate, taskApis.list);
router.post('/', Authenticate.authenticate, taskApis.post);
router.put('/:id', Authenticate.authenticate, taskApis.put);
router.delete('/:id', Authenticate.authenticate, taskApis.delete);

module.exports = router;
