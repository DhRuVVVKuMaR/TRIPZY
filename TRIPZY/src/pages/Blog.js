import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const BlogContainer = styled.div`
  min-height: 100vh;
  padding: 120px 20px 40px;
  background: ${props => props.theme.colors.background};
`;

const Blog = () => {
  return (
    <BlogContainer>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Blog
      </motion.h1>
    </BlogContainer>
  );
};

export default Blog; 