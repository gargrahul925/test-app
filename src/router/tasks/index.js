const router = require('express').Router();
const taskApis = require('./tasks');

const { authenticate } = require('./../../lib/middlewares');

router.get('/:id', authenticate, taskApis.get);
router.get('/', authenticate, taskApis.list);
router.post('/', authenticate, taskApis.post);
router.put('/:id', authenticate, taskApis.put);
router.delete('/:id', authenticate, taskApis.delete);

module.exports = router;
