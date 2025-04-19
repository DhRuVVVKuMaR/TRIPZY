import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const AboutContainer = styled.div`
  min-height: 100vh;
  padding: 120px 20px 40px;
  background: ${props => props.theme.colors.background};
`;

const About = () => {
  return (
    <AboutContainer>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        About Us
      </motion.h1>
    </AboutContainer>
  );
};

export default About; 