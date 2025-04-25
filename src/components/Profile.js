import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { signInWithGoogle, signUpWithEmail, signInWithEmail } from '../firebase/firebase';
import { Box, Button, TextField, Typography, Paper, Container, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';

const ProfileContainer = styled(motion.div)`
  min-height: 100vh;
  width: 100%;
  padding: 100px 20px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.isDark ? '#121212' : '#f8f9fa'};
  transition: all 0.3s ease;
`;

const StyledPaper = styled(motion.div)`
  background: ${props => props.theme.isDark ? '#1E1E1E' : '#ffffff'};
  border-radius: 24px;
  border: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  box-shadow: ${props => props.theme.isDark 
    ? '0 20px 40px rgba(0, 0, 0, 0.4)' 
    : '0 20px 40px rgba(0, 0, 0, 0.1)'};
  overflow: hidden;
  width: 100%;
  max-width: 480px;
  position: relative;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    margin: 10px;
    width: calc(100% - 20px);
  }
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: ${props => props.theme.isDark 
    ? 'linear-gradient(135deg, rgba(13, 211, 84, 0.6), rgba(13, 211, 84, 0.4))'
    : 'linear-gradient(135deg, #0dd354, #0dd354dd)'};
  clip-path: polygon(0 0, 100% 0, 100% 70%, 0 100%);
  z-index: 0;
`;

const UserProfileSection = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.5rem;
  position: relative;
  z-index: 1;
  background: transparent;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: 2rem 1.5rem;
  }
`;

const AvatarContainer = styled(motion.div)`
  position: relative;
  margin-bottom: 1.5rem;
`;

const UserAvatar = styled(motion.img)`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid ${props => props.theme.isDark ? '#2d2d2d' : '#ffffff'};
  box-shadow: ${props => props.theme.isDark 
    ? '0 8px 24px rgba(13, 211, 84, 0.3)' 
    : '0 8px 24px rgba(13, 211, 84, 0.2)'};
  transition: all 0.3s ease;
`;

const EditButton = styled(IconButton)`
  && {
    position: absolute;
    bottom: 0;
    right: 0;
    background: ${props => props.theme.isDark ? '#2d2d2d' : '#0dd354'};
    color: ${props => props.theme.isDark ? '#0dd354' : '#ffffff'};
    padding: 8px;
    border: 3px solid ${props => props.theme.isDark ? '#1E1E1E' : '#ffffff'};
    transition: all 0.3s ease;

    &:hover {
      background: ${props => props.theme.isDark ? '#333333' : '#0dd354dd'};
      transform: scale(1.1);
    }
  }
`;

const UserInfo = styled(motion.div)`
  text-align: center;
  margin-bottom: 2rem;
  width: 100%;
`;

const UserName = styled(Typography)`
  && {
    color: ${props => props.theme.isDark ? '#ffffff' : '#000000'};
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
`;

const UserEmail = styled(Typography)`
  && {
    color: ${props => props.theme.isDark ? '#b3b3b3' : '#666666'};
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    svg {
      color: ${props => props.theme.isDark ? '#0dd354' : '#666666'};
    }
  }
`;

const AuthContainer = styled(motion.div)`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: ${props => props.theme.isDark ? '#1E1E1E' : '#ffffff'};
`;

const StyledTextField = styled(TextField)`
  && {
    margin-bottom: 1rem;
    width: 100%;

    .MuiOutlinedInput-root {
      background: ${props => props.theme.isDark ? '#2d2d2d' : '#f8f9fa'};
      border-radius: 12px;
      transition: all 0.3s ease;

      &:hover {
        background: ${props => props.theme.isDark ? '#333333' : '#ffffff'};
      }

      fieldset {
        border-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
      }

      &.Mui-focused fieldset {
        border-color: #0dd354;
      }
    }

    .MuiInputLabel-root {
      color: ${props => props.theme.isDark ? '#b3b3b3' : '#666666'};

      &.Mui-focused {
        color: #0dd354;
      }
    }

    input {
      color: ${props => props.theme.isDark ? '#ffffff' : '#000000'};
    }

    svg {
      color: ${props => props.theme.isDark ? '#0dd354' : '#666666'};
    }
  }
`;

const GoogleButton = styled(Button)`
  && {
    background: ${props => props.theme.isDark ? '#2d2d2d' : '#ffffff'};
    color: ${props => props.theme.isDark ? '#ffffff' : '#000000'};
    text-transform: none;
    font-size: 1rem;
    padding: 12px;
    border-radius: 12px;
    border: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
    transition: all 0.3s ease;

    &:hover {
      background: ${props => props.theme.isDark ? '#333333' : '#f8f9fa'};
      transform: translateY(-2px);
      box-shadow: ${props => props.theme.isDark 
        ? '0 4px 12px rgba(255, 255, 255, 0.1)' 
        : '0 4px 12px rgba(0, 0, 0, 0.1)'};
    }

    .MuiButton-startIcon {
      margin-right: 12px;
      color: ${props => props.theme.isDark ? '#0dd354' : '#666666'};
    }
  }
`;

const ActionButton = styled(Button)`
  && {
    background: ${props => props.theme.isDark 
      ? 'linear-gradient(135deg, rgba(13, 211, 84, 0.8), rgba(13, 211, 84, 0.6))'
      : 'linear-gradient(135deg, #0dd354, #0dd354dd)'};
    color: #ffffff;
    text-transform: none;
    font-size: 1rem;
    font-weight: 500;
    padding: 12px;
    border-radius: 12px;
    transition: all 0.3s ease;
    box-shadow: ${props => props.theme.isDark 
      ? '0 4px 12px rgba(13, 211, 84, 0.2)' 
      : '0 4px 12px rgba(13, 211, 84, 0.2)'};

    &:hover {
      background: ${props => props.theme.isDark 
        ? 'linear-gradient(135deg, rgba(13, 211, 84, 0.9), rgba(13, 211, 84, 0.7))'
        : 'linear-gradient(135deg, #0dd354dd, #0dd354)'};
      transform: translateY(-2px);
      box-shadow: ${props => props.theme.isDark 
        ? '0 6px 16px rgba(13, 211, 84, 0.3)' 
        : '0 6px 16px rgba(13, 211, 84, 0.3)'};
    }
  }
`;

const SignOutButton = styled(Button)`
  && {
    background: ${props => props.theme.isDark ? '#2d2d2d' : '#f8f9fa'};
    color: ${props => props.theme.isDark ? '#ff6b6b' : '#dc3545'};
    text-transform: none;
    font-size: 1rem;
    font-weight: 500;
    padding: 12px;
    border-radius: 12px;
    border: 1px solid ${props => props.theme.isDark ? 'rgba(255, 107, 107, 0.5)' : '#dc3545'};
    transition: all 0.3s ease;

    &:hover {
      background: ${props => props.theme.isDark ? '#333333' : '#fff0f0'};
      transform: translateY(-2px);
      box-shadow: ${props => props.theme.isDark 
        ? '0 4px 12px rgba(255, 107, 107, 0.2)' 
        : '0 4px 12px rgba(220, 53, 69, 0.1)'};
    }

    .MuiButton-startIcon {
      margin-right: 8px;
      color: ${props => props.theme.isDark ? '#ff6b6b' : '#dc3545'};
    }
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  margin: 1.5rem 0;
  position: relative;

  &:before {
    content: 'or';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: ${props => props.theme.isDark ? '#1E1E1E' : '#ffffff'};
    padding: 0 1rem;
    color: ${props => props.theme.isDark ? '#b3b3b3' : '#666666'};
    font-size: 0.9rem;
  }
`;

const ErrorText = styled(Typography)`
  && {
    color: ${props => props.theme.isDark ? '#ff6b6b' : '#dc3545'};
    margin: 1rem 0;
    font-size: 0.9rem;
    text-align: center;
    background: ${props => props.theme.isDark ? 'rgba(255, 107, 107, 0.1)' : 'rgba(220, 53, 69, 0.1)'};
    padding: 8px;
    border-radius: 8px;
  }
`;

const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230dd354'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

const Profile = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      setError('');
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
      setError('');
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Failed to sign out. Please try again.');
    }
  };

  return (
    <ProfileContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <StyledPaper
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {currentUser ? (
          <>
            <BackgroundPattern />
            <UserProfileSection>
              <AvatarContainer
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
              >
                <UserAvatar
                  src={currentUser.photoURL || defaultAvatar}
                  alt="User Avatar"
                  onError={(e) => {
                    e.target.src = defaultAvatar;
                  }}
                  whileHover={{ scale: 1.05 }}
                />
                <EditButton size="small">
                  <EditIcon fontSize="small" />
                </EditButton>
              </AvatarContainer>

              <UserInfo
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <UserName variant="h4">
                  {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
                </UserName>
                <UserEmail variant="body1">
                  <EmailIcon fontSize="small" />
                  {currentUser.email}
                </UserEmail>
                <SignOutButton
                  fullWidth
                  onClick={handleSignOut}
                  startIcon={<LogoutIcon />}
                >
                  Sign Out
                </SignOutButton>
              </UserInfo>
            </UserProfileSection>
          </>
        ) : (
          <AuthContainer>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom 
                align="center" 
                sx={{ 
                  mb: 4,
                  fontWeight: 600,
                  color: theme => theme.isDark ? '#ffffff' : '#000000'
                }}
              >
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </Typography>

              <GoogleButton
                fullWidth
                variant="contained"
                startIcon={<GoogleIcon />}
                onClick={handleGoogleSignIn}
              >
                Continue with Google
              </GoogleButton>

              <Divider />

              <Box component="form" onSubmit={handleEmailAuth}>
                <StyledTextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, opacity: 0.7 }} />
                  }}
                />
                <StyledTextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: <LockIcon sx={{ mr: 1, opacity: 0.7 }} />
                  }}
                />
                {error && <ErrorText>{error}</ErrorText>}
                <ActionButton
                  fullWidth
                  type="submit"
                  variant="contained"
                  sx={{ mb: 3 }}
                >
                  {isSignUp ? 'Sign Up' : 'Sign In'}
                </ActionButton>
              </Box>

              <Typography 
                variant="body2" 
                align="center"
                sx={{ 
                  color: theme => theme.isDark ? '#e0e0e0' : '#666666'
                }}
              >
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <Button
                  variant="text"
                  onClick={() => setIsSignUp(!isSignUp)}
                  sx={{
                    textTransform: 'none',
                    color: '#0dd354',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: 'rgba(13, 211, 84, 0.1)'
                    }
                  }}
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </Button>
              </Typography>
            </motion.div>
          </AuthContainer>
        )}
      </StyledPaper>
    </ProfileContainer>
  );
};

export default Profile; 