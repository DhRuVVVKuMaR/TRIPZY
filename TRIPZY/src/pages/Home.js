import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Features from '../components/Features';

const HomeContainer = styled.div`
  min-height: 100vh;
  padding-top: 80px;
`;

const HeroSection = styled.section`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background};
`;

const HeroContent = styled.div`
  text-align: center;
  max-width: 800px;
  padding: 0 2rem;
  z-index: 1;
`;

const Title = styled(motion.h1)`
  font-size: 4rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.8;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 1.2rem;
  }
`;

const CTAButton = styled(motion.button)`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background};
  border: none;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const BackgroundAnimation = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  opacity: 0.1;
`;

const Home = () => {
  return (
    <HomeContainer>
      <HeroSection>
        <BackgroundAnimation
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
        >
          {/* Add your background animation here */}
        </BackgroundAnimation>
        
        <HeroContent>
          <Title
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Travel together,
            <br />
            Stress together never
          </Title>
          
          <Subtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            TRIPZY revolutionizes group travel planning with smart tools for coordination,
            expense management, and real-time tracking.
          </Subtitle>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <CTAButton
              as={Link}
              to="/waitlist"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join Waitlist
            </CTAButton>
          </motion.div>
        </HeroContent>
      </HeroSection>
      <Features />
    </HomeContainer>
  );
};

export default Home; 