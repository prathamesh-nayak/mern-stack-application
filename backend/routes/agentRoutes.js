const express = require('express');
const router = express.Router();
const { addAgent, getAgents, deleteAgent } = require('../controllers/agentController');
const auth = require('../middleware/auth');

router.post('/', auth, addAgent);
router.get('/', auth, getAgents);
router.delete('/:id', auth, deleteAgent);

module.exports = router;
