const Task = require('../models/Task');
const Agent = require('../models/Agent');
const xlsx = require('xlsx');
const fs = require('fs');

exports.uploadAndDistribute = async (req, res) => {
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
    const tasksPerAgent = Math.floor(data.length / numAgents);
    const remainder = data.length % numAgents;

    let currentTaskIndex = 0;
    const createdTasks = [];

    for (let i = 0; i < numAgents; i++) {
      const tasksToAssign = tasksPerAgent + (i < remainder ? 1 : 0);
      
      for (let j = 0; j < tasksToAssign; j++) {
        const item = data[currentTaskIndex++];
        const task = new Task({
          firstName: item.FirstName || item.firstname || item['First Name'],
          phone: item.Phone || item.phone || item['Phone Number'],
          notes: item.Notes || item.notes || '',
          assignedTo: agents[i]._id
        });
        createdTasks.push(task);
      }
    }

    await Task.insertMany(createdTasks);

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.status(201).json({ 
      message: `Successfully distributed ${data.length} tasks among ${numAgents} agents.`,
      totalTasks: data.length,
      agentsCount: numAgents
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error processing file' });
  }
};

exports.getDistributedTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo', 'name email');
    
    // Group tasks by agent
    const groupedTasks = tasks.reduce((acc, task) => {
      const agentId = task.assignedTo._id.toString();
      if (!acc[agentId]) {
        acc[agentId] = {
          agent: task.assignedTo,
          tasks: []
        };
      }
      acc[agentId].tasks.push(task);
      return acc;
    }, {});

    res.json(Object.values(groupedTasks));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteAllTasks = async (req, res) => {
  try {
    await Task.deleteMany({});
    res.json({ message: 'All tasks have been cleared.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
