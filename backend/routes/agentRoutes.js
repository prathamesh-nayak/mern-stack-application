const express = require('express');
const router = express.Router();
const { addAgent, getAgents, deleteAgent, updateAgent } = require('../controllers/agentController');
const auth = require('../middleware/auth');

router.post('/', auth, addAgent);
router.get('/', auth, getAgents);
router.put('/:id', auth, updateAgent);
router.delete('/:id', auth, deleteAgent);

module.exports = router;
