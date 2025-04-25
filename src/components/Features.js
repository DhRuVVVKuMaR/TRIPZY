import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const FeaturesSection = styled.section`
  padding: 120px 20px;
  background: ${({ theme }) => theme.colors.background};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${({ theme }) => theme.colors.primary}30, transparent);
  }
`;

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 3.5rem;
  text-align: center;
  margin-bottom: 5rem;
  color: ${({ theme }) => theme.colors.text};
  position: relative;
  display: block;
  width: 100%;
  text-align: center;
  font-weight: 800;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 4px;
    background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
    border-radius: 2px;
    transform: scaleX(0);
    transform-origin: center;
    transition: transform 0.3s ease;
  }

  &:hover::after {
    transform: translateX(-50%) scaleX(1);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 2.8rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  padding: 0 1rem;
  perspective: 1000px;
`;

const FeatureIcon = styled(motion.div)`
  font-size: 3.5rem;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.primary};
  transition: all 0.3s ease;
  display: inline-block;
  position: relative;
  z-index: 1;
  padding: 1.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}15, ${({ theme }) => theme.colors.secondary}15);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}10, ${({ theme }) => theme.colors.secondary}10);
    transform: scale(0);
    transition: transform 0.3s ease;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  position: relative;
  display: inline-block;
  font-weight: 700;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 0;
    height: 3px;
    background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
    border-radius: 2px;
    transition: width 0.3s ease;
  }
`;

const FeatureDescription = styled.p`
  font-size: 1.2rem;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.8;
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;
`;

const FeatureCard = styled(motion.div)`
  background: transparent;
  perspective: 1000px;
  height: 400px;
  cursor: pointer;
`;

const CardInner = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
  transform: ${props => props.isFlipped ? 'rotateY(180deg)' : 'rotateY(0)'};
`;

const CardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background: ${({ theme }) => theme.colors.gray.light};
  border-radius: 30px;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.gray.medium};
`;

const CardFront = styled(CardFace)`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.gray.light}, ${({ theme }) => theme.colors.primary}05);
`;

const CardBack = styled(CardFace)`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}10, ${({ theme }) => theme.colors.gray.light});
  transform: rotateY(180deg);
`;

const FeatureDetails = styled.div`
  margin-top: 1.5rem;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.9;
  line-height: 1.6;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
  text-align: left;
`;

const FeatureListItem = styled.li`
  margin-bottom: 0.8rem;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  
  &::before {
    content: '✓';
    color: ${({ theme }) => theme.colors.primary};
    margin-right: 0.8rem;
    font-weight: bold;
  }
`;

const FlipHint = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.6;
  transition: opacity 0.3s ease;
  
  ${FeatureCard}:hover & {
    opacity: 0;
  }
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 20%, ${({ theme }) => theme.colors.primary}05 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, ${({ theme }) => theme.colors.secondary}05 0%, transparent 50%);
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
    description: "Split costs automatically and manage group finances without awkward money talks.",
    details: [
      "Real-time expense tracking",
      "Automatic split calculations",
      "Multiple currency support",
      "Receipt scanning and storage",
      "Payment reminders"
    ]
  },
  {
    icon: "📱",
    title: "Smart Itineraries",
    description: "Create, share and update travel plans that sync across everyone's devices.",
    details: [
      "Drag-and-drop planning",
      "Real-time updates",
      "Offline access",
      "Weather integration",
      "Local recommendations"
    ]
  },
  {
    icon: "💬",
    title: "Group Chat",
    description: "Centralized communication for your entire travel group.",
    details: [
      "Real-time messaging",
      "File sharing",
      "Location sharing",
      "Poll creation",
      "Announcement system"
    ]
  },
  {
    icon: "🤖",
    title: "AI Suggestions",
    description: "Get personalized recommendations based on your group's preferences.",
    details: [
      "Smart itinerary suggestions",
      "Restaurant recommendations",
      "Activity planning",
      "Budget optimization",
      "Local insights"
    ]
  },
  {
    icon: "📊",
    title: "Real-time Tracking",
    description: "Stay updated with live location sharing and trip progress.",
    details: [
      "Live location sharing",
      "ETA calculations",
      "Group check-ins",
      "Emergency alerts",
      "Route optimization"
    ]
  },
  {
    icon: "🎯",
    title: "Customizable Plans",
    description: "Tailor your travel experience to match your group's unique needs.",
    details: [
      "Flexible scheduling",
      "Custom categories",
      "Personal preferences",
      "Group voting",
      "Activity ratings"
    ]
  }
];

const Features = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [flippedCards, setFlippedCards] = useState({});

  const toggleCard = (index) => {
    setFlippedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

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
              onClick={() => toggleCard(index)}
            >
              <CardInner isFlipped={flippedCards[index]}>
                <CardFront>
                  <FeatureIcon
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 5,
                      transition: { duration: 0.2 }
                    }}
                  >
                    {feature.icon}
                  </FeatureIcon>
                  <FeatureTitle>{feature.title}</FeatureTitle>
                  <FeatureDescription>{feature.description}</FeatureDescription>
                  <FlipHint>Click to see details</FlipHint>
                </CardFront>
                <CardBack>
                  <FeatureTitle>{feature.title}</FeatureTitle>
                  <FeatureList>
                    {feature.details.map((detail, i) => (
                      <FeatureListItem key={i}>{detail}</FeatureListItem>
                    ))}
                  </FeatureList>
                </CardBack>
              </CardInner>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </FeaturesContainer>
    </FeaturesSection>
  );
};

export default Features; 