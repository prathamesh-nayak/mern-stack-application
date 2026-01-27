const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadAndDistribute, getDistributedTasks } = require('../controllers/taskController');
const auth = require('../middleware/auth');
const path = require('path');

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.csv', '.xlsx', '.xls'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only CSV and Excel files are allowed.'), false);
  }
};

const upload = multer({ storage, fileFilter });

router.post('/upload', auth, upload.single('file'), uploadAndDistribute);
router.get('/distributed', auth, getDistributedTasks);
router.delete('/delete-all', auth, require('../controllers/taskController').deleteAllTasks);

module.exports = router;
