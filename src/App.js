import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AnimatePresence } from 'framer-motion';
import { pageVariants, pageTransition } from './styles/animations';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Blog from './pages/Blog';
import AIPlanner from './pages/AIPlanner';
import Waitlist from './pages/Waitlist';
import Test from './pages/Test';
import ExpenseManager from './pages/ExpenseManager';
import GroupChat from './pages/GroupChat';
import Profile from './components/Profile';
import { AuthProvider } from './context/AuthContext';

const AppContent = () => {
  const { theme } = useTheme();
  const location = useLocation();
  
  return (
    <StyledThemeProvider theme={theme}>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/expense-manager" element={<ExpenseManager />} />
          <Route path="/ai-planner" element={<AIPlanner />} />
          <Route path="/join-waitlist" element={<Waitlist />} />
          <Route path="/test" element={<Test />} />
          <Route path="/group-chat" element={<GroupChat />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </AnimatePresence>
    </StyledThemeProvider>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App; 