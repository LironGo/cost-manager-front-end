/**
 * Application root component
 * Provides the main layout and tab navigation between features.
 */
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
// Theme centralizes colors/typography so the app has consistent styling

/**
 * Renders the content of a single tab when active.
 * @param {object} props
 * @param {React.ReactNode} props.children - Content to render
 * @param {number} props.value - Current active tab index
 * @param {number} props.index - This panel's index
 */
function TabPanel({ children, value, index, ...other }) {
  // Hide content when its index does not match the selected tab
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

/**
 * App component renders the top navigation and routes to feature tabs.
 */
function App() {
  // Track which tab is currently selected in the UI
  const [currentTab, setCurrentTab] = useState(0);

  // Update selected tab when user clicks a different tab header
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    // Provide the Material UI theme and normalize styles across browsers
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        {/* Top app bar with application title */}
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Cost Manager
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {/* Tabs control the active feature view */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={currentTab} onChange={handleTabChange} aria-label="cost manager tabs">
              <Tab label="Add Cost" />
              <Tab label="Monthly Report" />
              <Tab label="Pie Chart" />
              <Tab label="Bar Chart" />
              <Tab label="Settings" />
            </Tabs>
          </Box>
          
          {/* Each TabPanel renders its feature when its index matches currentTab */}
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
