import React, { useEffect, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import EventIcon from '@mui/icons-material/Event';
import SchoolIcon from '@mui/icons-material/School';
import FeedbackIcon from '@mui/icons-material/Feedback';
import ReportIcon from '@mui/icons-material/Report';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useNavigate } from 'react-router-dom';

const sidebarLinks = [
  { label: 'Home', path: '/', icon: <HomeIcon /> },
  { label: 'Jobs', path: '/jobs', icon: <WorkIcon /> },
  { label: 'Events', path: '/events', icon: <EventIcon /> },
  { label: 'Mentorship', path: '/mentorship', icon: <SchoolIcon /> },
  { label: 'Feedback', path: '/feedback', icon: <FeedbackIcon /> },
  { label: 'Complaints', path: '/complaints', icon: <ReportIcon /> },
  { label: 'Admin Dashboard', path: '/admin', icon: <DashboardIcon /> }
];

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const openHandler = () => setOpen(true);
    const closeHandler = () => setOpen(false);
    window.addEventListener('openSidebar', openHandler);
    window.addEventListener('closeSidebar', closeHandler);
    return () => {
      window.removeEventListener('openSidebar', openHandler);
      window.removeEventListener('closeSidebar', closeHandler);
    };
  }, []);

  return (
    <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
      <Box sx={{ width: 260 }} role="presentation">
        <List>
          {sidebarLinks.map(link => (
            <ListItem key={link.label} disablePadding>
              <ListItemButton onClick={() => { setOpen(false); navigate(link.path); }}>
                <ListItemIcon>{link.icon}</ListItemIcon>
                <ListItemText primary={link.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
