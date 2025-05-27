import { BugReport, Build, Cloud, Gavel, Lock, Phishing, Security, Warning } from '@mui/icons-material';
import { Box, Card, CardContent, Chip, Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React from 'react';
import './App.css';

// Static JSON data for the dashboard
const threatData = {
  systems: [
    { id: 1, name: 'Web Server 01', status: 'Critical', threatLevel: 'High', vulnerabilities: ['CVE-2025-1234', 'CVE-2025-5678'], lastScan: '2025-05-22' },
    { id: 2, name: 'Database Server', status: 'Stable', threatLevel: 'Low', vulnerabilities: [], lastScan: '2025-05-21' },
    { id: 3, name: 'File Server', status: 'Warning', threatLevel: 'Medium', vulnerabilities: ['CVE-2025-9012'], lastScan: '2025-05-20' }
  ],
  applications: [
    { id: 1, name: 'CRM App', version: '2.1.3', status: 'Exposed', threats: ['SQL Injection', 'XSS'], lastUpdate: '2025-05-15' },
    { id: 2, name: 'HR Portal', version: '1.4.0', status: 'Secure', threats: [], lastUpdate: '2025-05-10' }
  ],
  buildPipelines: [
    { id: 1, name: 'Frontend CI/CD', status: 'Running', securityIssues: ['Unsecured API Key'], lastRun: '2025-05-23 08:00' },
    { id: 2, name: 'Backend CI/CD', status: 'Failed', securityIssues: ['Hardcoded Credentials'], lastRun: '2025-05-22 14:30' }
  ],
  cloudServices: [
    { id: 1, name: 'AWS S3 Bucket', status: 'Public', risks: ['Misconfigured Permissions'], lastChecked: '2025-05-22' },
    { id: 2, name: 'Azure VM', status: 'Secure', risks: [], lastChecked: '2025-05-21' }
  ],
  threatCategories: [
    { category: 'Malware', count: 12, severity: 'High', description: 'Detected malicious software attempts' },
    { category: 'Phishing', count: 25, severity: 'Medium', description: 'Suspicious email campaigns' },
    { category: 'DDoS', count: 3, severity: 'Critical', description: 'Distributed denial-of-service attacks' },
    { category: 'Insider Threats', count: 5, severity: 'Low', description: 'Unauthorized internal access attempts' }
  ]
};

// Functions to retrieve static data
const getSystems = () => threatData.systems;
const getApplications = () => threatData.applications;
const getBuildPipelines = () => threatData.buildPipelines;
const getCloudServices = () => threatData.cloudServices;
const getThreatCategories = () => threatData.threatCategories;

// Helper function to get threat level color and icon
const getThreatLevelStyles = (threatLevel: string) => {
  switch (threatLevel) {
    case 'High':
      return { color: '#d32f2f', icon: <Warning sx={{ color: '#d32f2f', verticalAlign: 'middle' }} /> };
    case 'Medium':
      return { color: '#ff9800', icon: <Warning sx={{ color: '#ff9800', verticalAlign: 'middle' }} /> };
    case 'Low':
      return { color: '#4caf50', icon: <Lock sx={{ color: '#4caf50', verticalAlign: 'middle' }} /> };
    default:
      return { color: '#757575', icon: <Lock sx={{ color: '#757575', verticalAlign: 'middle' }} /> };
  }
};

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Critical':
    case 'Exposed':
    case 'Failed':
    case 'Public':
      return '#d32f2f';
    case 'Warning':
      return '#ff9800';
    case 'Stable':
    case 'Secure':
    case 'Running':
      return '#4caf50';
    default:
      return '#757575';
  }
};

// Helper function to get category icon
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Malware':
      return <BugReport sx={{ color: '#d32f2f', mr: 1 }} />;
    case 'Phishing':
      return <Phishing sx={{ color: '#ff9800', mr: 1 }} />;
    case 'DDoS':
      return <Gavel sx={{ color: '#d32f2f', mr: 1 }} />;
    case 'Insider Threats':
      return <Security sx={{ color: '#757575', mr: 1 }} />;
    default:
      return <Security sx={{ color: '#757575', mr: 1 }} />;
  }
};

const App: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ padding: '20px', bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#1976d2' }}>
        <Security sx={{ verticalAlign: 'middle', mr: 1 }} /> Threat Intelligence Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Threat Categories Summary */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, bgcolor: '#ffffff' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>Threat Categories</Typography>
            <Grid container spacing={2}>
              {getThreatCategories().map((category) => (
                <Grid item xs={12} sm={6} md={3} key={category.category}>
                  <Card sx={{ bgcolor: '#fafafa', borderRadius: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        {getCategoryIcon(category.category)}
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{category.category}</Typography>
                      </Box>
                      <Typography color="textSecondary">Count: {category.count}</Typography>
                      <Chip
                        label={category.severity}
                        size="small"
                        sx={{ bgcolor: getThreatLevelStyles(category.severity).color, color: '#fff', mt: 1 }}
                      />
                      <Typography variant="body2" sx={{ mt: 1 }}>{category.description}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Systems Table */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, bgcolor: '#ffffff' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}><Security sx={{ verticalAlign: 'middle', mr: 1 }} /> Systems</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#1976d2' }}>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>System Name</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Threat Level</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Vulnerabilities</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Last Scan</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getSystems().map((system) => (
                    <TableRow key={system.id} sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}>
                      <TableCell>{system.name}</TableCell>
                      <TableCell>
                        <Chip label={system.status} sx={{ bgcolor: getStatusColor(system.status), color: '#fff' }} />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', color: getThreatLevelStyles(system.threatLevel).color }}>
                          {getThreatLevelStyles(system.threatLevel).icon}
                          <Typography sx={{ ml: 1 }}>{system.threatLevel}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{system.vulnerabilities.join(', ') || 'None'}</TableCell>
                      <TableCell>{system.lastScan}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Applications Table */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, bgcolor: '#ffffff' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}><BugReport sx={{ verticalAlign: 'middle', mr: 1 }} /> Applications</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#1976d2' }}>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Application</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Version</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Threats</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Last Update</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getApplications().map((app) => (
                    <TableRow key={app.id} sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}>
                      <TableCell>{app.name}</TableCell>
                      <TableCell>{app.version}</TableCell>
                      <TableCell>
                        <Chip label={app.status} sx={{ bgcolor: getStatusColor(app.status), color: '#fff' }} />
                      </TableCell>
                      <TableCell>{app.threats.join(', ') || 'None'}</TableCell>
                      <TableCell>{app.lastUpdate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Build Pipelines Table */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, bgcolor: '#ffffff' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}><Build sx={{ verticalAlign: 'middle', mr: 1 }} /> Build Pipelines</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#1976d2' }}>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Pipeline</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Security Issues</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Last Run</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getBuildPipelines().map((pipeline) => (
                    <TableRow key={pipeline.id} sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}>
                      <TableCell>{pipeline.name}</TableCell>
                      <TableCell>
                        <Chip label={pipeline.status} sx={{ bgcolor: getStatusColor(pipeline.status), color: '#fff' }} />
                      </TableCell>
                      <TableCell>{pipeline.securityIssues.join(', ') || 'None'}</TableCell>
                      <TableCell>{pipeline.lastRun}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Cloud Services Table */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, bgcolor: '#ffffff' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}><Cloud sx={{ verticalAlign: 'middle', mr: 1 }} /> Cloud Services</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#1976d2' }}>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Cloud Service</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Risks</TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Last Checked</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getCloudServices().map((service) => (
                    <TableRow key={service.id} sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}>
                      <TableCell>{service.name}</TableCell>
                      <TableCell>
                        <Chip label={service.status} sx={{ bgcolor: getStatusColor(service.status), color: '#fff' }} />
                      </TableCell>
                      <TableCell>{service.risks.join(', ') || 'None'}</TableCell>
                      <TableCell>{service.lastChecked}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;