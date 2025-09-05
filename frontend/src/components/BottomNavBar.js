import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import EventIcon from '@mui/icons-material/Event';
import SchoolIcon from '@mui/icons-material/School';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';

export default function BottomNavBar() {
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100 }} elevation={3}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          if (newValue === 0) navigate('/student-home');
          if (newValue === 1) navigate('/jobs');
          if (newValue === 2) navigate('/events');
          if (newValue === 3) navigate('/mentorship');
          if (newValue === 4) navigate('/profile');
        }}
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Jobs" icon={<WorkIcon />} />
        <BottomNavigationAction label="Events" icon={<EventIcon />} />
        <BottomNavigationAction label="Mentorship" icon={<SchoolIcon />} />
        <BottomNavigationAction label="Profile" icon={<AccountCircleIcon />} />
      </BottomNavigation>
    </Paper>
  );
}
