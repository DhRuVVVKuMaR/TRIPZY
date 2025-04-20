import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const PlannerContainer = styled(motion.div)`
  min-height: 100vh;
  padding: 120px 20px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ theme, isDarkMode }) => 
    isDarkMode 
      ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
      : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
  };
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 20%, rgba(255, 255, 255, ${({ isDarkMode }) => isDarkMode ? '0.05' : '0.1'}) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(255, 255, 255, ${({ isDarkMode }) => isDarkMode ? '0.05' : '0.1'}) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const IframeContainer = styled.div`
  width: 100%;
  max-width: 800px;
  height: 688px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: ${({ theme, isDarkMode }) => 
    isDarkMode 
      ? '0 10px 30px rgba(0, 0, 0, 0.3)'
      : '0 10px 30px rgba(0, 0, 0, 0.1)'
  };
  position: relative;
  z-index: 1;
  background: ${({ isDarkMode }) => isDarkMode ? '#2d2d2d' : 'white'};
`;

const AIPlanner = () => {
  const { isDarkMode } = useTheme();

  useEffect(() => {
    // Load Jotform embed handler script
    const script = document.createElement('script');
    script.src = 'https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js';
    script.async = true;
    document.body.appendChild(script);

    // Initialize Jotform embed handler when script is loaded
    script.onload = () => {
      window.jotformEmbedHandler(
        "iframe[id='JotFormIFrame-0196525c34fe77cebdf10614e8d04ae131b6']",
        "https://www.jotform.com"
      );
    };

    return () => {
      // Cleanup script when component unmounts
      document.body.removeChild(script);
    };
  }, []);

  const handleIframeLoad = () => {
    window.parent.scrollTo(0, 0);
  };

  return (
    <PlannerContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      isDarkMode={isDarkMode}
    >
      <IframeContainer isDarkMode={isDarkMode}>
        <iframe
          id="JotFormIFrame-0196525c34fe77cebdf10614e8d04ae131b6"
          title="Gideon: Travel Consultant"
          onLoad={handleIframeLoad}
          allowTransparency="true"
          allow="geolocation; microphone; camera; fullscreen"
          src="https://agent.jotform.com/0196525c34fe77cebdf10614e8d04ae131b6?embedMode=iframe&background=1&shadow=1"
          frameBorder="0"
          style={{
            minWidth: '100%',
            maxWidth: '100%',
            height: '688px',
            width: '100%'
          }}
          scrolling="no"
        />
      </IframeContainer>
    </PlannerContainer>
  );
};

export default AIPlanner; 