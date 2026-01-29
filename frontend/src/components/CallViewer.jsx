import React, { useState, useEffect } from 'react';
import { Accordion, Table, Badge, Spinner, Alert, Card, Button } from 'react-bootstrap';
import { getDistributedCalls, deleteAllCalls, updateCallStatus } from '../services/api';

const CallViewer = () => {
  const [groupedCalls, setGroupedCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCalls();
  }, []);

  const fetchCalls = async () => {
    setLoading(true);
    try {
      const { data } = await getDistributedCalls();
      setGroupedCalls(data);
    } catch (err) {
      setError('Failed to load distributed calls.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to delete ALL calls? This action cannot be undone.')) return;
    try {
      await deleteAllCalls();
      fetchCalls();
    } catch (err) {
      setError('Failed to clear calls.');
    }
  };

  const handleMakeCall = async (agentId, e) => {
    e.stopPropagation(); // Prevent accordion toggle
    const groupIndex = groupedCalls.findIndex(g => g.agent._id === agentId);
    if (groupIndex === -1) return;

    const group = groupedCalls[groupIndex];
    const callToCall = group.calls.find(c => c.status !== 'called');

    if (!callToCall) {
      alert('All calls for this agent have been called!');
      return;
    }

    try {
      await updateCallStatus(callToCall._id, 'called');
      
      const newGroupedCalls = [...groupedCalls];
      newGroupedCalls[groupIndex].calls = newGroupedCalls[groupIndex].calls.map(c => 
        c._id === callToCall._id ? { ...c, status: 'called' } : c
      );
      setGroupedCalls(newGroupedCalls);
    } catch (err) {
      console.error(err);
      setError('Failed to update call status.');
    }
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Card className="card-custom">
      <Card.Header className="card-header-custom d-flex justify-content-between align-items-center">
        <span>Distributed Calls by Agent</span>
        <div>
          <Badge bg="info" className="me-2">{groupedCalls.length} Agents Assigned</Badge>
          {groupedCalls.length > 0 && (
            <Button variant="danger" size="sm" onClick={handleClearAll}>
              Clear All Calls
            </Button>
          )}
        </div>
      </Card.Header>
      <Card.Body>
        {groupedCalls.length === 0 ? (
          <p className="text-center text-muted">No calls distributed yet. Upload a file to see results.</p>
        ) : (
          <Accordion defaultActiveKey="0">
            {groupedCalls.map((group, index) => (
              <Accordion.Item eventKey={index.toString()} key={group.agent._id}>
                <Accordion.Header>
                  <div className="d-flex align-items-center w-100 me-3">
                    <strong>{group.agent.name}</strong> 
                    <span className="ms-2 text-muted">({group.agent.email})</span>
                    <Badge bg="secondary" className="ms-2">{group.calls.length} calls</Badge>
                    
                    <div className="ms-auto d-flex align-items-center">
                      <Button variant="primary" size="sm" onClick={(e) => handleMakeCall(group.agent._id, e)}>Make a Call</Button>
                      <Badge bg="success" className="ms-2">
                        Called: {group.calls.filter(c => c.status === 'called').length}
                      </Badge>
                    </div>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>First Name</th>
                        <th>Mobile</th>
                        <th>Email</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.calls.map((call, idx) => (
                        <tr key={call._id} className={call.status === 'called' ? 'table-success' : ''}>
                          <td>{idx + 1}</td>
                          <td>{call.firstName}</td>
                          <td>{call.mobile}</td>
                          <td>{call.email}</td>
                          <td>
                            {call.status === 'called' ? (
                              <Badge bg="success">Called</Badge>
                            ) : (
                              <Badge bg="warning" text="dark">Pending</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        )}
      </Card.Body>
    </Card>
  );
};

export default CallViewer;