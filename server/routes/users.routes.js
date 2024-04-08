const router = require('express').Router();
const controller = require('../controllers/users.controllers');

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/verify_token', controller.verify_token);
router.post('/add_List' , controller.add_List)
router.post('/remove_List' , controller.remove_List)

module.exports = router;
