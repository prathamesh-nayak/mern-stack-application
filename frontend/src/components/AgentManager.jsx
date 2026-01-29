import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Row, Col, Alert, Card } from 'react-bootstrap';
import { addAgent, getAgents, deleteAgent, updateAgent } from '../services/api';

const AgentManager = () => {
  const [agents, setAgents] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const { data } = await getAgents();
      setAgents(data);
    } catch (err) {
      console.error('Failed to fetch agents');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if(formData.mobileNumber.length != 10){
      window.alert("mobile number should be 10 digit")
      return
    }
    try {
      if (editingId) {
        await updateAgent(editingId, formData);
        setSuccess('Agent updated successfully!');
        setEditingId(null);
      } else {
        await addAgent(formData);
        setSuccess('Agent added successfully!');
      }
      setFormData({ name: '', email: '', mobileNumber: '', password: '' });
      fetchAgents();
    } catch (err) {
      setError(err.response?.data?.message || (editingId ? 'Failed to update agent' : 'Failed to add agent'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this agent?')) return;
    try {
      await deleteAgent(id);
      fetchAgents();
    } catch (err) {
      setError('Failed to delete agent');
    }
  };
  const handleEdit = (id) => {
    const agentToEdit = agents.find(agent => agent._id === id);
    if (agentToEdit) {
      setFormData({
        name: agentToEdit.name,
        email: agentToEdit.email,
        mobileNumber: agentToEdit.mobileNumber,
        password: '' // Password not populated for security
      });
      setEditingId(id);
      setSuccess('');
      setError('');
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', mobileNumber: '', password: '' });
    setSuccess('');
    setError('');
  };

  return (
    <Row>
      <Col md={4}>
        <Card className="card-custom">
          <Card.Header className="card-header-custom">{editingId ? 'Edit Agent' : 'Add New Agent'}</Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-2">
                <Form.Label>Name</Form.Label>
                <Form.Control 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Email</Form.Label>
                <Form.Control 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control 
                  type="text"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required={!editingId}
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                {editingId ? 'Update Agent' : 'Add Agent'}
              </Button>
              {editingId && (
                <Button variant="secondary" className="w-100 mt-2" onClick={handleCancelEdit}>
                  Cancel Edit
                </Button>
              )}
            </Form>
          </Card.Body>
        </Card>
      </Col>
      <Col md={8}>
        <Card className="card-custom">
          <Card.Header className="card-header-custom">Agents List ({agents.length})</Card.Header>
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((agent) => (
                  <tr key={agent._id}>
                    <td>{agent.name}</td>
                    <td>{agent.email}</td>
                    <td>{agent.mobileNumber}</td>
                    <td>
                      <Button variant="primary" size="sm" onClick={() => handleEdit(agent._id)} className='m-1'>
                        Edit
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(agent._id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
                {agents.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center">No agents found. Add some to distribute tasks.</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default AgentManager;
