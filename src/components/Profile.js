import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { signInWithGoogle, signUpWithEmail, signInWithEmail } from '../firebase/firebase';
import { Box, Button, TextField, Typography, Paper, Container } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';

const ProfileContainer = styled(Container)`
  min-height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.theme.colors.background};
  transition: background-color 0.3s ease;
`;

const StyledPaper = styled(Paper)`
  background: ${props => props.theme.isDark ? '#1E1E1E' : '#ffffff'} !important;
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 480px;
  margin: 20px;
  border-radius: 16px;
  overflow: hidden;
`;

const GoogleButton = styled(Button)`
  && {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    text-transform: none;
    font-size: 1rem;
    font-weight: 500;
    border: 1px solid ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    padding: 12px;
    border-radius: 12px;

    &:hover {
      background: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : '#f8f8f8'};
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .MuiButton-startIcon {
      margin-right: 12px;
    }
  }
`;

const StyledTextField = styled(TextField)`
  && {
    margin-bottom: 1rem;

    .MuiOutlinedInput-root {
      background: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'};
      backdrop-filter: blur(5px);
      border-radius: 12px;

      &:hover .MuiOutlinedInput-notchedOutline {
        border-color: #0dd354;
      }
    }

    .MuiOutlinedInput-notchedOutline {
      border-color: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
      border-radius: 12px;
    }

    .MuiInputLabel-root {
      color: ${props => props.theme.colors.text};
    }

    input {
      color: ${props => props.theme.colors.text};
      padding: 16px;
    }
  }
`;

const ActionButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #0dd354, #0dd354dd);
    color: white;
    text-transform: none;
    font-size: 1rem;
    font-weight: 500;
    padding: 12px;
    box-shadow: 0 4px 12px rgba(13, 211, 84, 0.2);
    border-radius: 12px;

    &:hover {
      background: linear-gradient(135deg, #0dd354dd, #0dd354);
      box-shadow: 0 6px 16px rgba(13, 211, 84, 0.3);
    }
  }
`;

const UserProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.5rem;
  text-align: center;
`;

const UserAvatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-bottom: 1.5rem;
  object-fit: cover;
  border: 4px solid #0dd354;
  box-shadow: 0 4px 12px rgba(13, 211, 84, 0.2);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const StyledTypography = styled(Typography)`
  && {
    color: ${props => props.theme.colors.text};
    transition: color 0.3s ease;
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: ${props => props.theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  margin: 24px 0;
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
    <ProfileContainer maxWidth={false} disableGutters>
      <StyledPaper elevation={3}>
        {currentUser ? (
          <UserProfileSection>
            <UserAvatar
              src={currentUser.photoURL || defaultAvatar}
              alt="User Avatar"
              onError={(e) => {
                e.target.src = defaultAvatar;
              }}
            />
            <StyledTypography variant="h4" sx={{ fontSize: '2rem', fontWeight: 600, mb: 1 }}>
              {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
            </StyledTypography>
            <StyledTypography variant="body1" sx={{ opacity: 0.8, mb: 3, fontSize: '1.1rem' }}>
              {currentUser.email}
            </StyledTypography>
            <ActionButton
              fullWidth
              variant="contained"
              onClick={handleSignOut}
              sx={{ maxWidth: '320px' }}
            >
              Sign Out
            </ActionButton>
          </UserProfileSection>
        ) : (
          <Box sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            background: isDarkMode ? '#1E1E1E' : '#ffffff'
          }}>
            <StyledTypography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              align="center" 
              sx={{ 
                mb: 4, 
                fontWeight: 600,
                fontSize: { xs: '1.75rem', sm: '2rem' }
              }}
            >
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </StyledTypography>

            <Box sx={{ width: '100%', maxWidth: '400px' }}>
              <GoogleButton
                fullWidth
                variant="contained"
                startIcon={<GoogleIcon />}
                onClick={handleGoogleSignIn}
                sx={{ mb: 3 }}
              >
                Continue with Google
              </GoogleButton>

              <Box sx={{ position: 'relative', my: 3 }}>
                <Divider />
                <StyledTypography 
                  variant="body1" 
                  align="center" 
                  sx={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: isDarkMode ? '#1E1E1E' : '#ffffff',
                    px: 2
                  }}
                >
                  or
                </StyledTypography>
              </Box>

              <Box component="form" onSubmit={handleEmailAuth}>
                <StyledTextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <StyledTextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {error && (
                  <Typography color="error" sx={{ mt: 2, mb: 2 }}>
                    {error}
                  </Typography>
                )}
                <ActionButton
                  fullWidth
                  type="submit"
                  variant="contained"
                  sx={{ mb: 3 }}
                >
                  {isSignUp ? 'Sign Up' : 'Sign In'}
                </ActionButton>
              </Box>

              <StyledTypography variant="body2" align="center">
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
              </StyledTypography>
            </Box>
          </Box>
        )}
      </StyledPaper>
    </ProfileContainer>
  );
};

export default Profile; 