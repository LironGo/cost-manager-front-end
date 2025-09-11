import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppBar, Toolbar, Typography, Container, Tabs, Tab, Box } from '@mui/material';
import AddCostForm from './components/AddCostForm';
import MonthlyReport from './components/MonthlyReport';
import PieChart from './charts/PieChart';
import BarChart from './charts/BarChart';
import Settings from './components/Settings';
// Create MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function App() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Cost Manager
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={currentTab} onChange={handleTabChange} aria-label="cost manager tabs">
              <Tab label="Add Cost" />
              <Tab label="Monthly Report" />
              <Tab label="Pie Chart" />
              <Tab label="Bar Chart" />
              <Tab label="Settings" />
            </Tabs>
          </Box>
          
          <TabPanel value={currentTab} index={0}>
            <AddCostForm />
          </TabPanel>
          
          <TabPanel value={currentTab} index={1}>
            <MonthlyReport />
          </TabPanel>
          
          <TabPanel value={currentTab} index={2}>
            <PieChart />
          </TabPanel>
          
          <TabPanel value={currentTab} index={3}>
            <BarChart />
          </TabPanel>
          
          <TabPanel value={currentTab} index={4}>
            <Settings />
          </TabPanel>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;
