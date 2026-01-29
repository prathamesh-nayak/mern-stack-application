const Agent = require('../models/Agent');

exports.addAgent = async (req, res) => {
  try {
    const { name, email, mobileNumber, password } = req.body;

    let isEmail = await Agent.findOne({ email });
    let isMobile = await Agent.findOne({mobileNumber})
    if (isEmail) {
      return res.status(400).json({ message: 'Agent already exists with this email' });
    }
    if (isMobile) {
      return res.status(400).json({ message: 'Agent already exists with this Mobile Number' });
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

exports.updateAgent = async (req, res) => {
  try {
    const { name, email, mobileNumber, password } = req.body;
    const agentId = req.params.id;

    let agent = await Agent.findById(agentId);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    // Check if email or mobile is taken by another agent
    if (email !== agent.email) {
      const emailExists = await Agent.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Agent already exists with this email' });
      }
    }

    if (mobileNumber !== agent.mobileNumber) {
      const mobileExists = await Agent.findOne({ mobileNumber });
      if (mobileExists) {
        return res.status(400).json({ message: 'Agent already exists with this Mobile Number' });
      }
    }

    agent.name = name || agent.name;
    agent.email = email || agent.email;
    agent.mobileNumber = mobileNumber || agent.mobileNumber;

    if (password) {
      agent.password = password;
    }

    await agent.save();

    res.json({ message: 'Agent updated successfully', agent: { id: agent._id, name: agent.name, email: agent.email, mobileNumber: agent.mobileNumber } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
