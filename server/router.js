const router = require('express').Router();
const controller = require('./controllers/controller');

router.get('/', controller.read);
router.post('/', controller.create);
router.put('/', controller.update);
router.delete('/', controller.delete);

//handle 404
router.all('*', function (req,res) {
  res.status(404).send('not found');
})

module.exports = router;