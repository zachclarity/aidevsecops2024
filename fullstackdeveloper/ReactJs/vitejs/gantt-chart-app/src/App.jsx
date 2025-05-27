import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';

// Sample JSON data for tasks within 9 AM to 5 PM on May 1, 2025
const tasks = [
  { id: 1, name: "Project Planning", start: "2025-05-01T09:00", end: "2025-05-01T11:30" },
  { id: 2, name: "Design Phase", start: "2025-05-01T10:00", end: "2025-05-01T12:00" },
  { id: 3, name: "Development", start: "2025-05-01T13:00", end: "2025-05-01T16:00" },
  { id: 4, name: "Testing", start: "2025-05-01T14:30", end: "2025-05-01T17:00" },
];

const GanttChart = () => {
  // Define 8-hour block (9 AM to 5 PM)
  const startHour = 9;
  const endHour = 17;
  const totalHours = endHour - startHour;

  // Generate hour markers
  const generateHourMarkers = () => {
    const hours = [];
    for (let i = startHour; i <= endHour; i++) {
      hours.push(i % 12 === 0 ? 12 : i % 12);
    }
    return hours;
  };

  const hourMarkers = generateHourMarkers();

  // Calculate task bar position and width
  const getTaskBarStyle = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const startMinutes = startDate.getHours() + startDate.getMinutes() / 60;
    const endMinutes = endDate.getHours() + endDate.getMinutes() / 60;
    const startOffset = startMinutes - startHour;
    const duration = endMinutes - startMinutes;
    return {
      left: `${(startOffset / totalHours) * 100}%`,
      width: `${(duration / totalHours) * 100}%`,
    };
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Gantt Chart (May 1, 2025)</Typography>
      <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Task Grid (Left) */}
        <TableContainer component={Paper} sx={{ width: { xs: '100%', md: 400 } }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><Typography variant="h6">Task</Typography></TableCell>
                <TableCell><Typography variant="h6">Start</Typography></TableCell>
                <TableCell><Typography variant="h6">End</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.name}</TableCell>
                  <TableCell>{new Date(task.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                  <TableCell>{new Date(task.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Gantt Chart (Right) */}
        <Box sx={{ flex: 1, border: 1, borderColor: 'grey.500' }}>
          <Box sx={{ position: 'relative', height: `${tasks.length * 64 + 48}px` }}>
            {/* Hour Markers (Columns) */}
            <Box sx={{ display: 'flex', borderBottom: 1, borderColor: 'grey.500' }}>
              {hourMarkers.map((hour, index) => (
                <Box
                  key={index}
                  sx={{
                    flex: 1,
                    textAlign: 'center',
                    py: 1,
                    fontSize: '0.875rem',
                    borderRight: index < hourMarkers.length - 1 ? 1 : 0,
                    borderColor: 'grey.500',
                    width: `${100 / hourMarkers.length}%`,
                    bgcolor: index % 2 === 0 ? '#FFFFFF' : 'grey.200',
                  }}
                >
                  {hour}:00 {hour < 12 ? 'AM' : 'PM'}
                </Box>
              ))}
            </Box>
            {/* Task Rows */}
            <Box sx={{ position: 'relative' }}>
              {tasks.map((task, index) => (
                <Box
                  key={task.id}
                  sx={{
                    position: 'absolute',
                    top: `${index * 64 + 16}px`,
                    height: 64,
                    width: '100%',
                    borderBottom: 1,
                    borderColor: 'grey.500',
                    bgcolor: index % 2 === 0 ? '#FFFFFF' : 'grey.200',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      height: 48,
                      borderRadius: 1,
                      bgcolor: 'primary.main',
                      ...getTaskBarStyle(task.start, task.end),
                    }}
                  >
                    {/* Start Marker */}
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 0,
                        height: '100%',
                        width: 2,
                        bgcolor: 'success.main',
                      }}
                      title={`Start: ${new Date(task.start).toLocaleTimeString()}`}
                    />
                    {/* End Marker */}
                    <Box
                      sx={{
                        position: 'absolute',
                        right: 0,
                        height: '100%',
                        width: 2,
                        bgcolor: 'error.main',
                      }}
                      title={`End: ${new Date(task.end).toLocaleTimeString()}`}
                    />
                    <Typography sx={{ color: 'white', textAlign: 'center', pt: 1.5, fontSize: '0.875rem' }}>
                      {task.name}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default function App() {
  return <GanttChart />;
}