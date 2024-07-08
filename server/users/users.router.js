const express = require('express');
const { fetchAllUsers } = require('./users.service');

const router = express.Router();

router.get('/', async (req, res) => {
  const users = await fetchAllUsers();
  console.log(users);
  res.json(users);
});

module.exports = router;
