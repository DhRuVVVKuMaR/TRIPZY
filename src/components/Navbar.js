import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Tooltip,
  MenuItem,
  Button
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const StyledAppBar = styled(AppBar)`
  && {
    background: ${props => props.isDarkMode 
      ? '#000000'
      : '#ffffff'};
    color: ${props => props.isDarkMode ? '#ffffff' : '#000000'};
    border-bottom: 1px solid ${props => props.isDarkMode 
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.1)'};
    box-shadow: ${props => props.isDarkMode 
      ? '0 4px 30px rgba(0, 0, 0, 0.5)'
      : '0 4px 30px rgba(0, 0, 0, 0.1)'};
    transition: all 0.3s ease;
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: ${props => props.isDarkMode ? '#ffffff' : '#000000'};
  font-weight: 700;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  padding: 8px 16px;
  border-radius: 12px;
  background: ${props => props.isDarkMode 
    ? '#111111'
    : '#f8f9fa'};

  &:hover {
    transform: translateY(-2px);
    background: ${props => props.isDarkMode 
      ? '#1a1a1a'
      : '#f1f3f5'};
  }

  svg {
    margin-right: 8px;
    color: #0dd354;
    font-size: 1.8rem;
    transition: all 0.3s ease;
  }

  &:hover svg {
    transform: rotate(-10deg);
  }
`;

const NavLink = styled(Link)`
  position: relative;
  color: ${props => props.isDarkMode ? '#ffffff' : '#000000'};
  text-decoration: none;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
  z-index: 1;
  background: ${props => props.active 
    ? props.isDarkMode 
      ? '#1a1a1a'
      : '#f8f9fa'
    : 'transparent'};

  &:hover {
    color: #0dd354;
    background: ${props => props.isDarkMode 
      ? '#1a1a1a'
      : '#f8f9fa'};
    transform: translateY(-2px);
  }

  &.active {
    color: #0dd354;
    font-weight: 600;
    background: ${props => props.isDarkMode 
      ? '#1a1a1a'
      : '#f8f9fa'};
    
    &:hover {
      color: #0dd354;
    }
  }
`;

const ThemeToggle = styled(IconButton)`
  && {
    margin-left: 16px;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    transition: all 0.3s ease;
    color: ${props => props.isDarkMode ? '#ffffff' : '#000000'};
    background: ${props => props.isDarkMode 
      ? '#111111'
      : '#f8f9fa'};
    border: 1px solid ${props => props.isDarkMode 
      ? '#1a1a1a'
      : '#e9ecef'};

    &:hover {
      background: ${props => props.isDarkMode 
        ? '#1a1a1a'
        : '#f1f3f5'};
      transform: translateY(-2px) rotate(180deg);
    }

    svg {
      transition: all 0.3s ease;
    }
  }
`;

const UserAvatar = styled(Avatar)`
  && {
    cursor: pointer;
    width: 40px;
    height: 40px;
    border: 2px solid #0dd354;
    transition: all 0.3s ease;
    background: ${props => props.isDarkMode ? '#1a1a1a' : '#ffffff'};

    &:hover {
      transform: scale(1.1);
      box-shadow: 0 0 20px rgba(13, 211, 84, 0.3);
    }
  }
`;

const MobileMenu = styled(Menu)`
  && {
    .MuiPaper-root {
      background: ${props => props.isDarkMode 
        ? '#000000'
        : '#ffffff'};
      border: 1px solid ${props => props.isDarkMode 
        ? '#1a1a1a'
        : '#e9ecef'};
      border-radius: 16px;
      margin-top: 8px;
      padding: 8px;
      min-width: 200px;
    }

    .MuiMenuItem-root {
      padding: 12px 24px;
      margin: 4px;
      border-radius: 12px;
      transition: all 0.3s ease;
      color: ${props => props.isDarkMode ? '#ffffff' : '#000000'};
      font-weight: 500;

      &:hover {
        background: ${props => props.isDarkMode 
          ? '#1a1a1a'
          : '#f8f9fa'};
        color: #0dd354;
        transform: translateX(4px);
      }
    }
  }
`;

const ActionButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #0dd354, #0dd354dd);
    color: white;
    text-transform: none;
    font-weight: 500;
    padding: 8px 24px;
    border-radius: 12px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(13, 211, 84, 0.2);

    &:hover {
      background: linear-gradient(135deg, #0dd354dd, #0dd354);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(13, 211, 84, 0.3);
    }
  }
`;

const MenuIconButton = styled(IconButton)`
  && {
    color: ${props => props.isDarkMode ? '#ffffff' : '#000000'};
    border-radius: 12px;
    padding: 8px;
    transition: all 0.3s ease;
    background: ${props => props.isDarkMode 
      ? '#111111'
      : '#f8f9fa'};
    border: 1px solid ${props => props.isDarkMode 
      ? '#1a1a1a'
      : '#e9ecef'};

    &:hover {
      background: ${props => props.isDarkMode 
        ? '#1a1a1a'
        : '#f1f3f5'};
      transform: translateY(-2px);
    }

    svg {
      font-size: 1.5rem;
    }
  }
`;

const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230dd354'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { currentUser } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const pages = [
    { title: 'Home', path: '/' },
    { title: 'About', path: '/about' },
    { title: 'Blog', path: '/blog' },
    { title: 'Expense Manager', path: '/expense-manager' },
    { title: 'AI Planner', path: '/ai-planner' },
    { title: 'Group Chat', path: '/group-chat' },
  ];

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getUserAvatar = () => {
    if (currentUser?.photoURL) {
      return currentUser.photoURL;
    }
    return defaultAvatar;
  };

  const getUserDisplayName = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName;
    }
    if (currentUser?.email) {
      return currentUser.email.split('@')[0];
    }
    return 'Profile';
  };

  return (
    <StyledAppBar position="fixed" isDarkMode={isDarkMode}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Desktop Logo */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 4 }}>
            <Logo to="/" isDarkMode={isDarkMode}>
              <FlightTakeoffIcon />
              Tripzy
            </Logo>
          </Box>

          {/* Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <MenuIconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              isDarkMode={isDarkMode}
            >
              <MenuIcon />
            </MenuIconButton>
            <MobileMenu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              isDarkMode={isDarkMode}
            >
              {pages.map((page) => (
                <MenuItem 
                  key={page.title} 
                  onClick={handleCloseNavMenu}
                  component={Link}
                  to={page.path}
                >
                  <Typography textAlign="center">{page.title}</Typography>
                </MenuItem>
              ))}
            </MobileMenu>
          </Box>

          {/* Mobile Logo */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
            <Logo to="/" isDarkMode={isDarkMode}>
              <FlightTakeoffIcon />
              Tripzy
            </Logo>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            {pages.map((page) => (
              <NavLink
                key={page.title}
                to={page.path}
                className={location.pathname === page.path ? 'active' : ''}
                onClick={handleCloseNavMenu}
                isDarkMode={isDarkMode}
              >
                {page.title}
              </NavLink>
            ))}
          </Box>

          {/* Right Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {!currentUser && (
              <ActionButton
                component={Link}
                to="/join-waitlist"
                variant="contained"
              >
                Join Waitlist
              </ActionButton>
            )}

            <ThemeToggle onClick={toggleTheme} size="large" isDarkMode={isDarkMode}>
              {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </ThemeToggle>

            {currentUser ? (
              <>
                <Tooltip title="Open settings">
                  <UserAvatar
                    onClick={handleOpenUserMenu}
                    src={getUserAvatar()}
                    alt={getUserDisplayName()}
                    isDarkMode={isDarkMode}
                  />
                </Tooltip>
                <MobileMenu
                  id="menu-appbar-user"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  isDarkMode={isDarkMode}
                >
                  <MenuItem component={Link} to="/profile" onClick={handleCloseUserMenu}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleSignOut}>
                    Sign Out
                  </MenuItem>
                </MobileMenu>
              </>
            ) : (
              <ActionButton
                component={Link}
                to="/profile"
                variant="contained"
              >
                Sign In
              </ActionButton>
            )}
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Navbar; 