const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadAndDistributeCalls, getDistributedCalls, updateCallStatus, deleteAllCalls } = require('../controllers/callController');
const auth = require('../middleware/auth');
const path = require('path');

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

router.post('/upload', auth, upload.single('file'), uploadAndDistributeCalls);
router.get('/distributed', auth, getDistributedCalls);
router.put('/:id/status', auth, updateCallStatus);
router.delete('/delete-all', auth, deleteAllCalls);

module.exports = router;