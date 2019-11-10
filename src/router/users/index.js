const router = require('express').Router();
const userApis = require('./users');

router.post('/login', userApis.login);
router.post('/register', userApis.register);

module.exports = router;
