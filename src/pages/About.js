import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const AboutContainer = styled.div`
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

const Section = styled(motion.section)`
  margin-bottom: 4rem;
  background: ${props => props.theme.colors.gray.light};
  padding: 2rem;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.theme.colors.gray.medium};
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1.5rem;
`;

const Paragraph = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1.5rem;
  opacity: 0.9;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const TeamMember = styled(motion.div)`
  background: ${props => props.theme.colors.gray.light};
  padding: 1.5rem;
  border-radius: 15px;
  text-align: center;
  backdrop-filter: blur(5px);
  border: 1px solid ${props => props.theme.colors.gray.medium};
`;

const MemberName = styled.h3`
  font-size: 1.3rem;
  color: ${props => props.theme.colors.primary};
  margin: 1rem 0 0.5rem;
`;

const MemberRole = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.text};
  opacity: 0.8;
`;

const About = () => {
  return (
    <AboutContainer>
      <Title
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        About Tripzy
      </Title>

      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <SectionTitle>Our Story</SectionTitle>
        <Paragraph>
          Tripzy was born from a simple observation: group travel planning is often more stressful than it needs to be. 
          Founded in 2025, we set out to revolutionize how friends, families, and teams plan their travels together.
        </Paragraph>
        <Paragraph>
          Our platform combines cutting-edge AI technology with intuitive design to make group travel planning 
          seamless, enjoyable, and efficient. We believe that the journey of planning should be as exciting as 
          the journey itself.
        </Paragraph>
      </Section>

      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <SectionTitle>Our Mission</SectionTitle>
        <Paragraph>
          At Tripzy, our mission is to transform group travel planning from a source of stress into a source of joy. 
          We're committed to creating tools that bring people together, simplify coordination, and make every trip 
          memorable for the right reasons.
        </Paragraph>
        <Paragraph>
          We envision a world where planning group trips is as enjoyable as taking them, where technology enhances 
          human connection rather than replacing it, and where every traveler feels empowered to create their perfect journey.
        </Paragraph>
      </Section>

      <Section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <SectionTitle>Our Team</SectionTitle>
        <Paragraph>
          We're a diverse team of travel enthusiasts, technologists, and problem-solvers united by our passion 
          for making travel better for everyone.
        </Paragraph>
        <TeamGrid>
          <TeamMember
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <MemberName>Dhruv Kumar</MemberName>
            <MemberRole>Full Stack Developer</MemberRole>
          </TeamMember>
          <TeamMember
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <MemberName>Amrit Kumar</MemberName>
            <MemberRole>App Developer</MemberRole>
          </TeamMember>
          <TeamMember
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <MemberName>Daksh Sachdeva</MemberName>
            <MemberRole>UI/UX Designer</MemberRole>
          </TeamMember>
        </TeamGrid>
      </Section>
    </AboutContainer>
  );
};

export default About; 