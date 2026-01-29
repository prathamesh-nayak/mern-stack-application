const Call = require('../models/Call');
const Agent = require('../models/Agent');
const xlsx = require('xlsx');
const fs = require('fs');

exports.uploadAndDistributeCalls = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const agents = await Agent.find().limit(5);
    if (agents.length === 0) {
      return res.status(400).json({ message: 'No agents available for distribution' });
    }

    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    if (data.length === 0) {
      return res.status(400).json({ message: 'The uploaded file is empty' });
    }

    const numAgents = Math.min(agents.length, 5);
    const callsPerAgent = Math.floor(data.length / numAgents);
    const remainder = data.length % numAgents;

    let currentCallIndex = 0;
    const createdCalls = [];

    for (let i = 0; i < numAgents; i++) {
      const callsToAssign = callsPerAgent + (i < remainder ? 1 : 0);
      
      for (let j = 0; j < callsToAssign; j++) {
        const item = data[currentCallIndex++];
        
        const firstName = item.FirstName || item.firstname || item['First Name'];
        const mobile = item.Mobile || item.mobile || item['Mobile Number'] || item.Phone || item.phone;
        const email = item.Email || item.email || item['Email Address'];

        if (firstName && mobile && email) {
             const call = new Call({
                firstName,
                mobile,
                email,
                assignedTo: agents[i]._id
            });
            createdCalls.push(call);
        }
      }
    }

    if (createdCalls.length > 0) {
        await Call.insertMany(createdCalls);
    }

    fs.unlinkSync(filePath);

    res.status(201).json({ 
      message: `Successfully distributed ${createdCalls.length} calls among ${numAgents} agents.`,
      totalCalls: createdCalls.length,
      agentsCount: numAgents
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error processing file' });
  }
};

exports.getDistributedCalls = async (req, res) => {
  try {
    const calls = await Call.find().populate('assignedTo', 'name email');
    
    const groupedCalls = calls.reduce((acc, call) => {
      const agentId = call.assignedTo._id.toString();
      if (!acc[agentId]) {
        acc[agentId] = {
          agent: call.assignedTo,
          calls: []
        };
      }
      acc[agentId].calls.push(call);
      return acc;
    }, {});

    res.json(Object.values(groupedCalls));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteAllCalls = async (req, res) => {
  try {
    await Call.deleteMany({});
    res.json({ message: 'All calls have been cleared.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateCallStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const call = await Call.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!call) {
      return res.status(404).json({ message: 'Call not found' });
    }

    res.json(call);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};