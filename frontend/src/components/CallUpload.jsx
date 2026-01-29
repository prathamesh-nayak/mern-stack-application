import React, { useState } from 'react';
import { Form, Button, Alert, Card, ProgressBar } from 'react-bootstrap';
import { uploadCallFile } from '../services/api';

const CallUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data } = await uploadCallFile(formData);
      setSuccess(data.message);
      setFile(null);
      // Reset file input
      document.getElementById('callFileInput').value = '';
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading file. Ensure it is CSV/XLSX and formatted correctly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="card-custom">
      <Card.Body className="p-5 text-center">
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control 
              id="callFileInput"
              type="file" 
              accept=".csv, .xlsx, .xls" 
              onChange={handleFileChange}
              disabled={loading}
            />
          </Form.Group>
          
          {loading && <ProgressBar animated now={100} label="Processing..." className="mb-3" />}
          
          <Button variant="primary" type="submit" disabled={loading || !file}>
            {loading ? 'Processing & Distributing...' : 'Upload & Distribute Calls'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CallUpload;