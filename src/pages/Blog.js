import React from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

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

const BlogImage = styled(motion.div)`
  height: 200px;
  background: ${props => `linear-gradient(45deg, ${props.theme.colors.primary}, ${props.theme.colors.secondary})`};
  position: relative;
  overflow: hidden;
  transition: transform 0.5s ease;
`;

const BlogCard = styled(motion.article)`
  background: ${props => props.theme.colors.gray.light};
  border-radius: 20px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
  border: 1px solid ${props => props.theme.colors.gray.medium};
  position: relative;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, ${props => props.theme.colors.primary}10, transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);

    &::before {
      opacity: 1;
    }

    ${BlogImage} {
      transform: scale(1.1);
    }
  }
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
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`;

const Blog = () => {
  const { scrollY } = useScroll();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const y = useTransform(scrollY, [0, 500], [0, 100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const blogPosts = [
    {
      title: "10 Tips to Plan a Group Trip Efficiently",
      excerpt: "Learn how to coordinate with friends, manage budgets, and create unforgettable memories together.",
      date: "March 15, 2024",
      readTime: "5 min read",
      category: "Travel Tips",
      link: "https://www.readysetholiday.co/10-tips-to-plan-a-group-trip-efficiently-2/"
    },
    {
      title: "The Future of AI in Travel Planning",
      excerpt: "Discover how artificial intelligence is revolutionizing the way we plan and experience travel.",
      date: "March 12, 2024",
      readTime: "7 min read",
      category: "Technology",
      link: "https://www.mckinsey.com/industries/travel/our-insights/what-ai-means-for-travel-now-and-in-the-future"
    },
    {
      title: "Sustainable Travel: A Guide for Eco-Conscious Explorers",
      excerpt: "How to make your group travels more eco-friendly while still having an amazing time.",
      date: "March 10, 2024",
      readTime: "6 min read",
      category: "Sustainability",
      link: "https://www.ecomatcher.com/how-to-travel-sustainably-a-guide-for-eco-conscious-explorers/"
    },
    {
      title: "Managing Group Expenses While Traveling",
      excerpt: "Practical tips and tools for handling money matters in group travel situations.",
      date: "March 8, 2024",
      readTime: "4 min read",
      category: "Finance",
      link: "https://use.expensify.com/resource-center/guides/how-to-split-travel-expenses-with-friends"
    },
    {
      title: "The Psychology of Group Travel",
      excerpt: "Understanding group dynamics and how to ensure everyone has a great time.",
      date: "March 5, 2024",
      readTime: "8 min read",
      category: "Psychology",
      link: "https://travelpsych.world/psych/traveler-traits/traveling-as-group-what-you-need-know/"
    },
    {
      title: "Hidden Gems: Off-the-Beaten-Path Destinations",
      excerpt: "Explore lesser-known destinations that are perfect for group adventures.",
      date: "March 3, 2024",
      readTime: "6 min read",
      category: "Destinations",
      link: "https://www.offthebeatentravel.com/"
    },
    {
      title: "Digital Nomad vs Remote Working: What's the Difference?",
      excerpt: "Understanding the key differences between digital nomadism and remote working, and how to choose the right lifestyle for you.",
      date: "March 1, 2024",
      readTime: "7 min read",
      category: "Lifestyle",
      link: "https://www.thenonmad.com/2024/02/08/digital-nomad-vs-remote-working-whats-in-a-word/"
    },
    {
      title: "9 Ways to Travel with Respect to Local Culture",
      excerpt: "Essential tips for respecting local customs, traditions, and people while traveling in groups.",
      date: "February 28, 2024",
      readTime: "8 min read",
      category: "Culture",
      link: "https://svet.charita.cz/en/news/9-ways-how-to-travel-with-respect-to-local-people-and-culture/"
    },
    {
      title: "Travel Photography: Capturing Epic Moments",
      excerpt: "Master the art of travel photography with expert tips for capturing stunning group memories and landscapes.",
      date: "February 25, 2024",
      readTime: "6 min read",
      category: "Photography",
      link: "https://epic.travel/travel-photography/"
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
      <BlogGrid
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {blogPosts.map((post, index) => (
          <BlogCard
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            onClick={() => window.open(post.link, '_blank')}
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