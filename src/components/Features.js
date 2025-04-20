import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const FeaturesSection = styled.section`
  padding: 100px 20px;
  background: ${({ theme }) => theme.colors.background};
  position: relative;
  overflow: hidden;
`;

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  color: ${({ theme }) => theme.colors.text};
  position: relative;
  display: block;
  width: 100%;
  text-align: center;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background: ${({ theme }) => theme.colors.primary};
    transform: scaleX(0);
    transform-origin: center;
    transition: transform 0.3s ease;
  }

  &:hover::after {
    transform: translateX(-50%) scaleX(1);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 2rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 0 1rem;
`;

const FeatureIcon = styled(motion.div)`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.primary};
  transition: transform 0.3s ease;
  display: inline-block;
  position: relative;
  z-index: 1;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text};
  position: relative;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: ${({ theme }) => theme.colors.primary};
    transition: width 0.3s ease;
  }
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.8;
  transition: opacity 0.3s ease;
`;

const FeatureCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.gray.light};
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid ${({ theme }) => theme.colors.gray.medium};
  position: relative;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, ${({ theme }) => theme.colors.primary}10, transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);

    &::before {
      opacity: 1;
    }

    ${FeatureIcon} {
      transform: scale(1.2) rotate(5deg);
    }

    ${FeatureTitle}::after {
      width: 100%;
    }

    ${FeatureDescription} {
      opacity: 1;
    }
  }
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, ${({ theme }) => theme.colors.primary}05 0%, transparent 70%);
  z-index: 0;
  animation: pulse 8s infinite;

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 0.1;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.15;
    }
    100% {
      transform: scale(1);
      opacity: 0.1;
    }
  }
`;

const features = [
  {
    icon: "💼",
    title: "Shared Expenses",
    description: "Split costs automatically and manage group finances without awkward money talks."
  },
  {
    icon: "📱",
    title: "Smart Itineraries",
    description: "Create, share and update travel plans that sync across everyone's devices."
  },
  {
    icon: "💬",
    title: "Group Chat",
    description: "Centralized communication for your entire travel group."
  },
  {
    icon: "🤖",
    title: "AI Suggestions",
    description: "Get personalized recommendations based on your group's preferences."
  },
  {
    icon: "📊",
    title: "Real-time Tracking",
    description: "Stay updated with live location sharing and trip progress."
  },
  {
    icon: "🎯",
    title: "Customizable Plans",
    description: "Tailor your travel experience to match your group's unique needs."
  }
];

const Features = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const controls = useAnimation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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

  const iconVariants = {
    hidden: { 
      scale: 0,
      rotate: -180
    },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    }
  };

  return (
    <FeaturesSection>
      <BackgroundPattern />
      <FeaturesContainer>
        <SectionTitle
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 10
          }}
        >
          Features of TRIPZY
        </SectionTitle>
        <FeaturesGrid
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ 
                scale: 0.95,
                transition: { duration: 0.1 }
              }}
            >
              <FeatureIcon
                variants={iconVariants}
                whileHover={{ 
                  scale: 1.2,
                  rotate: 10,
                  transition: { duration: 0.2 }
                }}
              >
                {feature.icon}
              </FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </FeaturesContainer>
    </FeaturesSection>
  );
};

export default Features; 