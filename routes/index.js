const express = require('express');
const router = express.Router();

// Do work here
router.get('/', (req, res) => {
  //res.send('Hey! It works!');
  res.render( 'hello', {
    name: 'Matt',
    dog: req.query.dog,
    title: 'I love food',
  } );
});

router.get('/reverse/:name', (req,res) => {
  const reverse = [...req.params.name].reverse().join('');
  res.send(reverse);
});

module.exports = router;
