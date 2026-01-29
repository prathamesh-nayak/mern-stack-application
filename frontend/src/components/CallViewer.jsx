import React, { useState, useEffect } from 'react';
import { Accordion, Table, Badge, Spinner, Alert, Card, Button } from 'react-bootstrap';
import { getDistributedTasks, deleteAllTasks } from '../services/api';

const CallViewer = () => {
  const [groupedTasks, setGroupedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data } = await getDistributedTasks();
      setGroupedTasks(data);
    } catch (err) {
      setError('Failed to load distributed lists.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to delete ALL tasks? This action cannot be undone.')) return;
    try {
      await deleteAllTasks();
      fetchTasks();
    } catch (err) {
      setError('Failed to clear tasks.');
    }
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Card className="card-custom">
      <Card.Header className="card-header-custom d-flex justify-content-between align-items-center">
        <span>Distributed Lists by Agent</span>
        <div>
          <Badge bg="info" className="me-2">{groupedTasks.length} Agents Assigned</Badge>
          {groupedTasks.length > 0 && (
            <Button variant="danger" size="sm" onClick={handleClearAll}>
              Clear All Tasks
            </Button>
          )}
        </div>
      </Card.Header>
      <Card.Body>
        {groupedTasks.length === 0 ? (
          <p className="text-center text-muted">No tasks distributed yet. Upload a file to see results.</p>
        ) : (
          <Accordion defaultActiveKey="0">
            {groupedTasks.map((group, index) => (
              <Accordion.Item eventKey={index.toString()} key={group.agent._id}>
                <Accordion.Header>
                  <strong>{group.agent.name}</strong> 
                  <span className="ms-2 text-muted">({group.agent.email})</span>
                  <Badge bg="secondary" className="ms-auto me-3">{group.tasks.length} tasks</Badge>
                  <Button variant="primary" size="sm">Make a Call</Button>
                </Accordion.Header>
                <Accordion.Body>
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>First Name</th>
                        <th>Phone</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.tasks.map((task, idx) => (
                        <tr key={task._id}>
                          <td>{idx + 1}</td>
                          <td>{task.firstName}</td>
                          <td>{task.phone}</td>
                          <td>{task.notes}</td>
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
