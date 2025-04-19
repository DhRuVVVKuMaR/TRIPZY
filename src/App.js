import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Blog from './pages/Blog';
import AIPlanner from './pages/AIPlanner';
import Waitlist from './pages/Waitlist';
import Test from './pages/Test';
import ExpenseManager from './pages/ExpenseManager';

const AppContent = () => {
  const { theme } = useTheme();
  
  return (
    <StyledThemeProvider theme={theme}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/expense-manager" element={<ExpenseManager />} />
        <Route path="/ai-planner" element={<AIPlanner />} />
        <Route path="/waitlist" element={<Waitlist />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </StyledThemeProvider>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App; 