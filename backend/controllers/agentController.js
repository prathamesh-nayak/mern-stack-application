const Agent = require('../models/Agent');

exports.addAgent = async (req, res) => {
  try {
    const { name, email, mobileNumber, password } = req.body;

    let agent = await Agent.findOne({ email });
    if (agent) {
      return res.status(400).json({ message: 'Agent already exists with this email' });
    }

    agent = new Agent({ name, email, mobileNumber, password });
    await agent.save();

    res.status(201).json({ message: 'Agent added successfully', agent: { id: agent._id, name, email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAgents = async (req, res) => {
  try {
    const agents = await Agent.find().select('-password');
    res.json(agents);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    
    await Agent.deleteOne({ _id: req.params.id });
    res.json({ message: 'Agent removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
