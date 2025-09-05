
import React, { useState } from 'react';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Jobs', path: '/jobs' },
  { label: 'Events', path: '/events' },
  { label: 'Mentorship', path: '/mentorship' },
  { label: 'Feedback', path: '/feedback' },
  { label: 'Complaints', path: '/complaints' },
  { label: 'Admin Dashboard', path: '/admin' }
];

const roles = [
  { label: 'Admin', icon: '🛡️' },
  { label: 'Alumni', icon: '🎓' },
  { label: 'Student', icon: '👨‍🎓' }
];

const Brand = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  letterSpacing: '2px',
  fontSize: '1.7rem',
  color: '#fff',
  textShadow: '0 2px 8px #1976d2',
  transition: 'color 0.3s',
  '&:hover': {
    color: '#90caf9',
  },
}));

export default function Navbar() {
  const [roleAnchorEl, setRoleAnchorEl] = useState(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState(3); // Example badge count
  const navigate = useNavigate();

  const handleRoleMenuOpen = (event) => {
    setRoleAnchorEl(event.currentTarget);
  };
  const handleRoleMenuClose = () => {
    setRoleAnchorEl(null);
  };
  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };
  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  return (
    <AppBar position="sticky" sx={{ background: 'linear-gradient(90deg, #1976d2 60%, #90caf9 100%)', boxShadow: 3 }}>
      <Toolbar>
        <Brand variant="h6">AlmaConnect</Brand>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
          {navLinks.map((link) => (
            <Button
              key={link.label}
              href={link.path}
              sx={{ color: '#fff', fontWeight: 500, '&:hover': { color: '#1976d2', background: '#e3f2fd' } }}
            >
              {link.label}
            </Button>
          ))}
          <Button
            color="inherit"
            onClick={handleRoleMenuOpen}
            sx={{ fontWeight: 500, textTransform: 'none' }}
          >
            Role
          </Button>
          <Menu anchorEl={roleAnchorEl} open={Boolean(roleAnchorEl)} onClose={handleRoleMenuClose}>
            {roles.map((role) => (
              <MenuItem key={role.label} onClick={handleRoleMenuClose}>
                <span style={{ marginRight: 8 }}>{role.icon}</span>
                {role.label}
              </MenuItem>
            ))}
          </Menu>
          <IconButton color="inherit">
            <Badge badgeContent={notifications} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          {/* Profile Icon - only show if logged in */}
          {localStorage.getItem('isLoggedIn') === 'true' && (
            <>
              <IconButton color="inherit" onClick={e => setProfileAnchorEl(e.currentTarget)} sx={{ ml: 1 }}>
                <AccountCircle />
              </IconButton>
              <Menu anchorEl={profileAnchorEl} open={Boolean(profileAnchorEl)} onClose={() => setProfileAnchorEl(null)}>
                <MenuItem onClick={() => {
                  setProfileAnchorEl(null);
                  const role = localStorage.getItem('userType');
                  if (role === 'admin') {
                    navigate('/admin/edit-profile');
                  } else if (role === 'student') {
                    navigate('/student/edit-profile');
                  } else if (role === 'alumni') {
                    navigate('/alumni/edit-profile');
                  } else {
                    navigate('/profile/edit');
                  }
                }}>Edit Profile</MenuItem>
                <MenuItem onClick={() => {
                  setProfileAnchorEl(null);
                  localStorage.removeItem('isLoggedIn');
                  localStorage.removeItem('userType');
                  navigate('/login');
                }}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Box>
        {/* Mobile Hamburger */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton color="inherit" onClick={handleMobileMenuOpen}>
            <MenuIcon />
          </IconButton>
          <Menu anchorEl={mobileMenuAnchorEl} open={Boolean(mobileMenuAnchorEl)} onClose={handleMobileMenuClose}>
            {navLinks.map((link) => (
              <MenuItem key={link.label} component="a" href={link.path} onClick={handleMobileMenuClose}>
                {link.label}
              </MenuItem>
            ))}
            <MenuItem onClick={handleRoleMenuOpen}>Role</MenuItem>
            <MenuItem onClick={e => setProfileAnchorEl(e.currentTarget)}>Profile</MenuItem>
          </Menu>
          <Menu anchorEl={profileAnchorEl} open={Boolean(profileAnchorEl)} onClose={() => setProfileAnchorEl(null)}>
            <MenuItem onClick={() => { setProfileAnchorEl(null); navigate('/profile/edit'); }}>Edit Profile</MenuItem>
            <MenuItem onClick={() => { setProfileAnchorEl(null); /* Add logout logic here */ navigate('/login'); }}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
