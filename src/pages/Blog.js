import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const BlogContainer = styled.div`
  min-height: 100vh;
  padding: 120px 20px 40px;
  background: ${props => props.theme.colors.background};
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 2rem;
  text-align: center;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: 2.5rem;
  }
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const BlogCard = styled(motion.article)`
  background: ${props => props.theme.colors.gray.light};
  border-radius: 20px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
  border: 1px solid ${props => props.theme.colors.gray.medium};
`;

const BlogImage = styled.div`
  height: 200px;
  background: ${props => `linear-gradient(45deg, ${props.theme.colors.primary}, ${props.theme.colors.secondary})`};
  position: relative;
  overflow: hidden;
`;

const BlogContent = styled.div`
  padding: 1.5rem;
`;

const BlogTitle = styled.h2`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
`;

const BlogExcerpt = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${props => props.theme.colors.text};
  opacity: 0.8;
  margin-bottom: 1rem;
`;

const BlogMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text};
  opacity: 0.7;
`;

const ReadMore = styled(motion.button)`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 1rem;
`;

const Blog = () => {
  const blogPosts = [
    {
      title: "10 Tips for Planning the Perfect Group Trip",
      excerpt: "Learn how to coordinate with friends, manage budgets, and create unforgettable memories together.",
      date: "March 15, 2024",
      readTime: "5 min read",
      category: "Travel Tips"
    },
    {
      title: "The Future of AI in Travel Planning",
      excerpt: "Discover how artificial intelligence is revolutionizing the way we plan and experience travel.",
      date: "March 12, 2024",
      readTime: "7 min read",
      category: "Technology"
    },
    {
      title: "Sustainable Travel: A Guide for Groups",
      excerpt: "How to make your group travels more eco-friendly while still having an amazing time.",
      date: "March 10, 2024",
      readTime: "6 min read",
      category: "Sustainability"
    },
    {
      title: "Managing Group Expenses While Traveling",
      excerpt: "Practical tips and tools for handling money matters in group travel situations.",
      date: "March 8, 2024",
      readTime: "4 min read",
      category: "Finance"
    },
    {
      title: "The Psychology of Group Travel",
      excerpt: "Understanding group dynamics and how to ensure everyone has a great time.",
      date: "March 5, 2024",
      readTime: "8 min read",
      category: "Psychology"
    },
    {
      title: "Hidden Gems: Off-the-Beaten-Path Destinations",
      excerpt: "Explore lesser-known destinations that are perfect for group adventures.",
      date: "March 3, 2024",
      readTime: "6 min read",
      category: "Destinations"
    }
  ];

  return (
    <BlogContainer>
      <Title
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Travel Blog
      </Title>

      <BlogGrid>
        {blogPosts.map((post, index) => (
          <BlogCard
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <BlogImage />
            <BlogContent>
              <BlogTitle>{post.title}</BlogTitle>
              <BlogExcerpt>{post.excerpt}</BlogExcerpt>
              <BlogMeta>
                <span>{post.date}</span>
                <span>{post.readTime}</span>
              </BlogMeta>
              <ReadMore
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Read More
              </ReadMore>
            </BlogContent>
          </BlogCard>
        ))}
      </BlogGrid>
    </BlogContainer>
  );
};

export default Blog; 