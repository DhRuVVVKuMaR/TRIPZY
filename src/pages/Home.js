import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import Features from '../components/Features';
import { fadeIn, slideUp, staggerContainer, hoverScale } from '../styles/animations';

const HomeContainer = styled.div`
  min-height: 100vh;
  padding-top: 80px;
  background: ${({ theme }) => theme.colors.background};
  overflow: hidden;
`;

const HeroSection = styled.section`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.background} 0%, ${({ theme }) => theme.colors.primary}15 100%);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 50% 50%, ${({ theme }) => theme.colors.primary}10 0%, transparent 70%);
    animation: gradientPulse 8s ease-in-out infinite;
  }
  
  @keyframes gradientPulse {
    0% {
      transform: scale(1);
      opacity: 0.5;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.8;
    }
    100% {
      transform: scale(1);
      opacity: 0.5;
    }
  }
`;

const HeroContent = styled.div`
  text-align: center;
  max-width: 800px;
  padding: 0 2rem;
  z-index: 1;
`;

const Title = styled(motion.h1)`
  font-size: 4.5rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 800;
  line-height: 1.2;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 3px;
    background: ${({ theme }) => theme.colors.primary};
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.5s ease;
  }
  
  &:hover::after {
    transform: scaleX(1);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.5rem;
  margin-bottom: 2.5rem;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.8;
  line-height: 1.6;
  position: relative;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 1.2rem;
  }
`;

const CTAButton = styled(motion.button)`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background};
  border: none;
  padding: 1rem 2.5rem;
  font-size: 1.2rem;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
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
  
  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    
    &::before {
      left: 100%;
    }
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    transform: scale(0);
    transition: transform 0.5s ease;
  }
  
  &:hover::after {
    transform: scale(1);
  }
`;

const ScrollIndicator = styled(motion.div)`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.6;
  cursor: pointer;
  width: 100%;
  text-align: center;
  
  span {
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    animation: fadeInOut 2s infinite;
    display: block;
    width: 100%;
  }
  
  @keyframes fadeInOut {
    0%, 100% {
      opacity: 0.4;
    }
    50% {
      opacity: 1;
    }
  }
`;

const MouseIcon = styled.div`
  width: 30px;
  height: 50px;
  border: 2px solid ${({ theme }) => theme.colors.text};
  border-radius: 15px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    width: 4px;
    height: 8px;
    background: ${({ theme }) => theme.colors.text};
    border-radius: 2px;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    animation: scroll 2s infinite;
  }
  
  @keyframes scroll {
    0% {
      transform: translate(-50%, 0);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, 20px);
      opacity: 0;
    }
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
  background: radial-gradient(circle at center, ${({ theme }) => theme.colors.primary}20 0%, transparent 70%);
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

const TravelIcon = styled(motion.div)`
  position: absolute;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.primary};
  opacity: 0.7;
  z-index: 1;
  animation: float 6s ease-in-out infinite;
  
  @keyframes float {
    0% {
      transform: translateY(0px) rotate(0deg);
    }
    50% {
      transform: translateY(-20px) rotate(5deg);
    }
    100% {
      transform: translateY(0px) rotate(0deg);
    }
  }
`;

const TravelIconsContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
`;

const CompassIcon = styled(TravelIcon)`
  top: 20%;
  left: 10%;
  font-size: 2rem;
  animation-delay: 0s;
`;

const MapIcon = styled(TravelIcon)`
  top: 40%;
  right: 15%;
  font-size: 1.8rem;
  animation-delay: 1s;
`;

const SuitcaseIcon = styled(TravelIcon)`
  bottom: 30%;
  left: 20%;
  font-size: 1.6rem;
  animation-delay: 2s;
`;

const PlaneIcon = styled(TravelIcon)`
  top: 60%;
  right: 25%;
  font-size: 2.2rem;
  animation-delay: 3s;
`;

const Home = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const { scrollY } = useScroll();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const y = useTransform(scrollY, [0, 500], [0, 100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    // Check if script is already loaded
    if (window.AgentInitializer) {
      initializeAgent();
      return;
    }

    // Load Jotform agent script
    const script = document.createElement('script');
    script.src = 'https://cdn.jotfor.ms/s/umd/latest/for-embedded-agent.js';
    script.async = true;
    script.onload = initializeAgent;
    document.body.appendChild(script);

    // Add scroll event listener
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const initializeAgent = () => {
    window.AgentInitializer.init({
      agentRenderURL: "https://agent.jotform.com/0196525c34fe77cebdf10614e8d04ae131b6",
      rootId: "JotformAgent-0196525c34fe77cebdf10614e8d04ae131b6",
      formID: "0196525c34fe77cebdf10614e8d04ae131b6",
      queryParams: ["skipWelcome=1", "maximizable=1"],
      domain: "https://www.jotform.com",
      isDraggable: false,
      background: "linear-gradient(180deg, #0dd534 0%, #525252 100%)",
      buttonBackgroundColor: "#004BB6",
      buttonIconColor: "#F8FEEC",
      variant: false,
      customizations: {
        "greeting": "Yes",
        "greetingMessage": "Hi! How can I assist you?",
        "openByDefault": "No",
        "pulse": "Yes",
        "position": "right",
        "autoOpenChatIn": "0"
      },
      isVoice: false,
    });
  };

  const scrollToFeatures = () => {
    const featuresSection = document.querySelector('#features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <HomeContainer>
      <HeroSection>
        <BackgroundAnimation
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 2 }}
        />
        <TravelIconsContainer>
          <CompassIcon
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 0.7 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            🧭
          </CompassIcon>
          <MapIcon
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 0.7 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            🗺️
          </MapIcon>
          <SuitcaseIcon
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 0.7 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            🧳
          </SuitcaseIcon>
          <PlaneIcon
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 0.7 }}
            transition={{ duration: 1, delay: 1.1 }}
          >
            ✈️
          </PlaneIcon>
        </TravelIconsContainer>
        <HeroContent>
          <Title
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Your Ultimate Travel Companion
          </Title>
          <Subtitle
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 0.8 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Plan, track, and share your travel experiences with ease. Join our waitlist to be the first to experience the future of travel planning.
          </Subtitle>
          <Link to="/join-waitlist">
            <CTAButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Join Waitlist
            </CTAButton>
          </Link>
        </HeroContent>
        <ScrollIndicator
          style={{ y, opacity }}
          onClick={scrollToFeatures}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <span>Scroll to explore</span>
          <MouseIcon />
        </ScrollIndicator>
      </HeroSection>
      <motion.div
        ref={ref}
        initial="initial"
        animate={inView ? "animate" : "initial"}
        variants={staggerContainer}
      >
        <Features />
      </motion.div>
    </HomeContainer>
  );
};

export default Home; 