const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// //create, find, update, delete

router.get('/', userController.view);
router.post('/', userController.find);
router.get('/adduser', userController.form);
router.post('/adduser', userController.create);
router.get('/edituser/:Id', userController.edit);
router.post('/edituser/:Id', userController.update);
router.get('/viewuser/:Id', userController.viewall);
router.get('/:Id',userController.delete);

// //Router
// router.get('', (req, res) => {
//     res.render('home');
// });


module.exports = router;