import React, { useState } from 'react';
import { Container, Nav, Navbar, Button, Tab, Tabs } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import AgentManager from '../components/AgentManager';
import FileUpload from '../components/FileUpload';
import TaskViewer from '../components/TaskViewer';
import CallUpload from '../components/CallUpload';
import CallViewer from '../components/CallViewer';

const DashboardPage = () => {
  const { user, logoutUser } = useAuth();
  const [key, setKey] = useState('agents');
  const [taskRefreshTrigger, setTaskRefreshTrigger] = useState(0);
  const [callRefreshTrigger, setCallRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    setTaskRefreshTrigger(prev => prev + 1);
    setKey('tasks');
  };

  const handleCallUploadSuccess = () => {
    setCallRefreshTrigger(prev => prev + 1);
    setKey('calls');
  };

  return (
    <>
      <Navbar className="navbar-custom" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home" className="fw-bold">Admin Dashboard</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Navbar.Text className="me-3 text-white-50">
              Welcome, <span className="text-white fw-bold">{user?.email}</span>
            </Navbar.Text>
            <Button 
              variant="light" 
              size="sm" 
              onClick={logoutUser}
              className="text-primary fw-bold"
            >
              Logout
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Tabs
          id="dashboard-tabs"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-4"
        >
          <Tab eventKey="agents" title="Manage Agents">
            <AgentManager />
          </Tab>
          <Tab eventKey="upload" title="Task Upload">
            <FileUpload onUploadSuccess={handleUploadSuccess} />
          </Tab>
          <Tab eventKey="tasks" title="Task Lists">
            <TaskViewer key={taskRefreshTrigger} />
          </Tab>
          <Tab eventKey="call-upload" title="Call Upload">
            <CallUpload onUploadSuccess={handleCallUploadSuccess} />
          </Tab>
          <Tab eventKey="calls" title="Call Lists">
            <CallViewer key={callRefreshTrigger} />
          </Tab>
        </Tabs>
      </Container>
    </>
  );
};

export default DashboardPage;
