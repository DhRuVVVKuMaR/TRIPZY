import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import ItineraryBuilder from '../components/ItineraryBuilder';

const PlannerContainer = styled.div`
  min-height: 100vh;
  padding: 120px 20px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ theme }) => theme.colors.background};
`;

const ChatContainer = styled.div`
  width: 100%;
  max-width: 800px;
  height: 600px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 20px;
  box-shadow: ${({ theme }) => theme.shadows.large};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ChatHeader = styled.div`
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ChatAvatar = styled.div`
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const ChatTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 600;
  font-family: ${({ theme }) => theme.fonts.heading};
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: ${({ theme }) => theme.colors.gray.light};
`;

const Message = styled(motion.div)`
  max-width: 80%;
  padding: 1rem;
  border-radius: 15px;
  line-height: 1.5;
  position: relative;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  
  ${({ isUser }) => isUser ? `
    align-self: flex-end;
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    border-bottom-right-radius: 5px;
  ` : `
    align-self: flex-start;
    background: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.secondary};
    border-bottom-left-radius: 5px;
    box-shadow: ${({ theme }) => theme.shadows.small};
  `}
`;

const InputContainer = styled.div`
  padding: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.gray.medium};
  display: flex;
  gap: 0.5rem;
  background: ${({ theme }) => theme.colors.white};
`;

const Input = styled.input`
  flex: 1;
  padding: 0.8rem;
  border: 2px solid ${({ theme }) => theme.colors.gray.medium};
  border-radius: 25px;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  transition: ${({ theme }) => theme.transitions.default};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SendButton = styled(motion.button)`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    transform: scale(1.1);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const TypingIndicator = styled(motion.div)`
  display: flex;
  gap: 0.3rem;
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 15px;
  align-self: flex-start;
  width: fit-content;
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const Dot = styled(motion.div)`
  width: 8px;
  height: 8px;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
`;

const PreferencesContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin-top: 20px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 20px;
  box-shadow: ${({ theme }) => theme.shadows.large};
  padding: 20px;
`;

const PreferenceSection = styled.div`
  margin-bottom: 20px;
`;

const PreferenceTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 10px;
`;

const PreferenceOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const PreferenceButton = styled(motion.button)`
  padding: 8px 16px;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 20px;
  background: ${({ selected }) => selected ? '${({ theme }) => theme.colors.primary}' : 'transparent'};
  color: ${({ selected }) => selected ? 'white' : '${({ theme }) => theme.colors.primary}'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  }
`;

const BudgetInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 2px solid ${({ theme }) => theme.colors.gray.medium};
  border-radius: 10px;
  margin-top: 10px;
`;

const ToggleButton = styled(motion.button)`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  margin-top: 20px;
  font-size: ${({ theme }) => theme.fontSizes.medium};
`;

const AIPlanner = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showItinerary, setShowItinerary] = useState(false);
  const [preferences, setPreferences] = useState({
    tripType: '',
    budget: '',
    duration: '',
    interests: [],
    travelStyle: ''
  });
  const [conversationContext, setConversationContext] = useState({
    lastTopic: '',
    mentionedDestinations: [],
    userPreferences: {},
    currentPhase: 'initial' // initial, preferences, planning, details
  });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial greeting message
    setTimeout(() => {
      setMessages([
        {
          id: 1,
          text: "👋 Hi there! I'm your AI travel assistant. I can help you plan your next adventure. What kind of trip are you looking to plan?",
          isUser: false
        }
      ]);
    }, 500);
  }, []);

  const handleSend = () => {
    if (input.trim() === '') return;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: input,
      isUser: true
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    // Update conversation context
    updateConversationContext(input);
    
    // Generate AI response
    setTimeout(() => {
      const aiResponse = generateResponse(input);
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: aiResponse,
        isUser: false
      }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handlePreferenceChange = (type, value) => {
    setPreferences(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleInterestToggle = (interest) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const updateConversationContext = (userInput) => {
    const lowerInput = userInput.toLowerCase();
    
    // Extract mentioned destinations
    const destinations = extractDestinations(lowerInput);
    if (destinations.length > 0) {
      setConversationContext(prev => ({
        ...prev,
        mentionedDestinations: [...new Set([...prev.mentionedDestinations, ...destinations])]
      }));
    }
    
    // Update conversation phase
    if (lowerInput.includes('itinerary') || lowerInput.includes('schedule') || lowerInput.includes('plan')) {
      setConversationContext(prev => ({
        ...prev,
        currentPhase: 'planning'
      }));
    } else if (lowerInput.includes('budget') || lowerInput.includes('cost') || lowerInput.includes('price')) {
      setConversationContext(prev => ({
        ...prev,
        currentPhase: 'details',
        lastTopic: 'budget'
      }));
    } else if (lowerInput.includes('hotel') || lowerInput.includes('accommodation') || lowerInput.includes('stay')) {
      setConversationContext(prev => ({
        ...prev,
        currentPhase: 'details',
        lastTopic: 'accommodation'
      }));
    } else if (lowerInput.includes('food') || lowerInput.includes('restaurant') || lowerInput.includes('eat')) {
      setConversationContext(prev => ({
        ...prev,
        currentPhase: 'details',
        lastTopic: 'food'
      }));
    }
  };

  const extractDestinations = (input) => {
    const commonDestinations = [
      'bali', 'paris', 'tokyo', 'new york', 'london', 'rome', 'barcelona', 
      'dubai', 'singapore', 'sydney', 'maldives', 'greece', 'italy', 'france',
      'japan', 'thailand', 'vietnam', 'cambodia', 'switzerland', 'germany',
      'spain', 'portugal', 'australia', 'new zealand', 'canada', 'mexico',
      'brazil', 'argentina', 'chile', 'peru', 'colombia', 'costa rica'
    ];
    
    return commonDestinations.filter(dest => input.includes(dest));
  };

  const generateResponse = (userInput) => {
    const lowerInput = userInput.toLowerCase();
    
    // Enhanced response generation based on preferences and context
    if (preferences.tripType && preferences.budget && preferences.duration) {
      return generatePersonalizedResponse(userInput, preferences);
    }
    
    // Context-aware responses
    if (conversationContext.currentPhase === 'planning') {
      return generatePlanningResponse(lowerInput);
    } else if (conversationContext.currentPhase === 'details') {
      return generateDetailsResponse(lowerInput, conversationContext.lastTopic);
    }
    
    // Basic responses
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      return "Hello! I'm your AI travel assistant. I can help you plan your next adventure. What kind of trip are you looking to plan?";
    }
    
    if (lowerInput.includes('beach') || lowerInput.includes('ocean')) {
      return "Great choice! For beach destinations, I'd recommend Bali, Maldives, or the Greek Islands. Would you like more details about any of these destinations?";
    }
    
    if (lowerInput.includes('mountain') || lowerInput.includes('hiking')) {
      return "Perfect for nature lovers! Consider the Swiss Alps, Patagonia, or the Canadian Rockies. These offer stunning views and great hiking trails. Which interests you most?";
    }
    
    if (lowerInput.includes('city') || lowerInput.includes('urban')) {
      return "City breaks are exciting! Tokyo, New York, or Barcelona are fantastic options with rich culture and activities. Would you like to know more about any of these cities?";
    }
    
    if (lowerInput.includes('budget') || lowerInput.includes('cheap')) {
      return "I can help you find budget-friendly destinations! Southeast Asia, Eastern Europe, and Central America offer great value. What's your approximate budget per day?";
    }
    
    if (lowerInput.includes('luxury') || lowerInput.includes('expensive')) {
      return "For luxury travel, consider the French Riviera, Dubai, or the Maldives. These destinations offer high-end accommodations and experiences. What's your preferred luxury experience?";
    }
    
    if (lowerInput.includes('food') || lowerInput.includes('cuisine')) {
      return "Food-focused trips are amazing! Japan, Italy, and Thailand are renowned for their culinary scenes. Would you like restaurant recommendations for any of these destinations?";
    }
    
    if (lowerInput.includes('help') || lowerInput.includes('what can you do')) {
      return "I can help you with: \n• Destination recommendations\n• Itinerary planning\n• Travel tips and advice\n• Budget planning\n• Accommodation suggestions\n\nWhat would you like to know more about?";
    }
    
    return "I'd be happy to help you plan your trip! Could you tell me more about your preferences? For example, are you looking for a beach vacation, city break, or adventure trip?";
  };

  const generatePersonalizedResponse = (userInput, prefs) => {
    const { tripType, budget, duration, interests, travelStyle } = prefs;
    const lowerInput = userInput.toLowerCase();
    
    // Check for specific destination queries
    const mentionedDestinations = extractDestinations(lowerInput);
    if (mentionedDestinations.length > 0) {
      return generateDestinationSpecificResponse(mentionedDestinations[0], prefs);
    }
    
    if (lowerInput.includes('suggest') || lowerInput.includes('recommend')) {
      return `Based on your preferences for a ${duration}-day ${tripType} trip with a budget of ${budget}, 
      I recommend considering ${getDestinationSuggestions(prefs)}. 
      Would you like me to create a detailed itinerary for any of these destinations?`;
    }
    
    if (lowerInput.includes('itinerary') || lowerInput.includes('schedule') || lowerInput.includes('plan')) {
      return generateItinerarySuggestion(prefs);
    }
    
    if (lowerInput.includes('budget') || lowerInput.includes('cost') || lowerInput.includes('price')) {
      return generateBudgetAdvice(prefs);
    }
    
    if (lowerInput.includes('accommodation') || lowerInput.includes('hotel') || lowerInput.includes('stay')) {
      return generateAccommodationAdvice(prefs);
    }
    
    if (lowerInput.includes('food') || lowerInput.includes('restaurant') || lowerInput.includes('eat')) {
      return generateFoodAdvice(prefs);
    }
    
    // Add more personalized response logic here
    return "I can help you plan your trip based on your preferences. What specific aspect would you like to know more about?";
  };

  const generateDestinationSpecificResponse = (destination, prefs) => {
    const { tripType, budget, duration, interests, travelStyle } = prefs;
    
    const destinationInfo = {
      'bali': {
        description: 'Tropical paradise with beautiful beaches, rich culture, and affordable luxury.',
        highlights: ['Ubud', 'Seminyak', 'Nusa Dua', 'Rice Terraces', 'Temple Tours'],
        bestTime: 'April to October',
        budget: 'Moderate',
        activities: ['Beach Relaxation', 'Temple Visits', 'Rice Field Trekking', 'Spa Treatments', 'Water Sports']
      },
      'paris': {
        description: 'City of light, romance, art, and fashion with iconic landmarks.',
        highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame', 'Champs-Élysées', 'Montmartre'],
        bestTime: 'April to June, September to October',
        budget: 'High',
        activities: ['Museum Visits', 'Cafe Hopping', 'Shopping', 'River Cruises', 'Food Tours']
      },
      'tokyo': {
        description: 'Futuristic metropolis with a perfect blend of tradition and innovation.',
        highlights: ['Shibuya Crossing', 'Senso-ji Temple', 'Tsukiji Market', 'Shinjuku Gyoen', 'Akihabara'],
        bestTime: 'March to May, September to November',
        budget: 'High',
        activities: ['Temple Visits', 'Food Exploration', 'Shopping', 'Garden Strolls', 'Technology Exploration']
      },
      // Add more destinations as needed
    };
    
    const info = destinationInfo[destination.toLowerCase()] || {
      description: 'A fantastic destination with many attractions.',
      highlights: ['Various attractions'],
      bestTime: 'Year-round',
      budget: 'Varies',
      activities: ['Various activities']
    };
    
    return `Great choice! ${destination} is ${info.description}
    
Highlights: ${info.highlights.join(', ')}
Best time to visit: ${info.bestTime}
Budget level: ${info.budget}
Popular activities: ${info.activities.join(', ')}

Would you like me to create a detailed itinerary for your ${duration} trip to ${destination}?`;
  };

  const generateItinerarySuggestion = (prefs) => {
    const { tripType, duration, interests } = prefs;
    
    const durationDays = duration === 'Weekend' ? 2 : 
                         duration === '1 Week' ? 7 : 
                         duration === '2 Weeks' ? 14 : 30;
    
    let itinerary = `Here's a suggested ${durationDays}-day itinerary for your ${tripType} trip:\n\n`;
    
    if (tripType === 'beach') {
      itinerary += `Day 1: Arrival and beach relaxation
Day 2: Water activities (snorkeling, diving, or boat tour)
Day 3: Island exploration and local culture
Day 4: Spa day and sunset viewing
Day 5: Adventure activities (hiking, zip-lining, etc.)
Day 6: Shopping and local markets
Day 7: Departure`;
    } else if (tripType === 'city') {
      itinerary += `Day 1: Arrival and city orientation
Day 2: Historical landmarks and museums
Day 3: Local neighborhoods and street food
Day 4: Shopping and entertainment districts
Day 5: Day trip to nearby attractions
Day 6: Parks and relaxation
Day 7: Departure`;
    } else if (tripType === 'mountain') {
      itinerary += `Day 1: Arrival and acclimation
Day 2: Easy hiking trails and scenic viewpoints
Day 3: Challenging hike to summit
Day 4: Rest day with local exploration
Day 5: Adventure activities (rock climbing, zip-lining)
Day 6: Nature observation and photography
Day 7: Departure`;
    } else {
      itinerary += `Day 1: Arrival and orientation
Day 2: Main attraction exploration
Day 3: Adventure activities
Day 4: Local culture and food
Day 5: Nature exploration
Day 6: Relaxation and shopping
Day 7: Departure`;
    }
    
    return itinerary;
  };

  const generateBudgetAdvice = (prefs) => {
    const { budget, tripType, duration } = prefs;
    
    const budgetNum = parseInt(budget) || 0;
    const durationDays = duration === 'Weekend' ? 2 : 
                         duration === '1 Week' ? 7 : 
                         duration === '2 Weeks' ? 14 : 30;
    
    const dailyBudget = budgetNum / durationDays;
    
    let advice = `Based on your budget of $${budgetNum} for ${durationDays} days (approximately $${dailyBudget.toFixed(0)} per day), here's how you might allocate it:\n\n`;
    
    if (dailyBudget < 50) {
      advice += `• Accommodation: $15-20/day (hostels, budget hotels)
• Food: $15-20/day (street food, local restaurants)
• Transportation: $5-10/day (public transit, walking)
• Activities: $10-15/day (free attractions, minimal paid activities)
• Miscellaneous: $5/day`;
    } else if (dailyBudget < 100) {
      advice += `• Accommodation: $30-40/day (mid-range hotels, Airbnb)
• Food: $25-30/day (mix of local restaurants and some nicer dining)
• Transportation: $10-15/day (mix of public transit and occasional taxis)
• Activities: $20-25/day (mix of free and paid attractions)
• Miscellaneous: $10/day`;
    } else if (dailyBudget < 200) {
      advice += `• Accommodation: $60-80/day (comfortable hotels, nice Airbnb)
• Food: $40-50/day (good restaurants, some fine dining)
• Transportation: $20-30/day (mix of public transit, taxis, and car rentals)
• Activities: $40-50/day (most paid attractions, some tours)
• Miscellaneous: $20/day`;
    } else {
      advice += `• Accommodation: $100+/day (luxury hotels, resorts)
• Food: $60+/day (fine dining, exclusive restaurants)
• Transportation: $40+/day (private transfers, car rentals)
• Activities: $80+/day (exclusive tours, premium experiences)
• Miscellaneous: $40+/day`;
    }
    
    return advice;
  };

  const generateAccommodationAdvice = (prefs) => {
    const { tripType, travelStyle, budget } = prefs;
    
    let advice = `Based on your ${travelStyle} travel style for a ${tripType} trip, here are some accommodation recommendations:\n\n`;
    
    if (travelStyle === 'luxury') {
      advice += `• 5-star hotels and resorts
• Boutique luxury properties
• Private villas with concierge service
• All-inclusive luxury packages
• Exclusive retreats`;
    } else if (travelStyle === 'comfort') {
      advice += `• 4-star hotels
• Boutique hotels
• Upscale Airbnb properties
• Resort properties with amenities
• Business hotels with good facilities`;
    } else if (travelStyle === 'budget') {
      advice += `• 3-star hotels
• Budget hotels and motels
• Mid-range Airbnb properties
• Hostels with private rooms
• Guesthouses and B&Bs`;
    } else {
      advice += `• Backpacker hostels
• Budget guesthouses
• Camping options
• Couchsurfing
• Budget Airbnb rooms`;
    }
    
    return advice;
  };

  const generateFoodAdvice = (prefs) => {
    const { tripType, interests } = prefs;
    
    let advice = `Here are some food recommendations for your ${tripType} trip:\n\n`;
    
    if (tripType === 'beach') {
      advice += `• Fresh seafood and beachside restaurants
• Tropical fruit and local specialties
• Beach bars and cafes
• Fresh coconut and tropical drinks
• Local markets for fresh produce`;
    } else if (tripType === 'city') {
      advice += `• Local street food and food markets
• Trendy restaurants and cafes
• Traditional local cuisine
• International dining options
• Food tours and cooking classes`;
    } else if (tripType === 'mountain') {
      advice += `• Hearty local dishes
• Mountain cafes and lodges
• Local cheese and dairy products
• Traditional stews and soups
• Local wine and craft beer`;
    } else {
      advice += `• Local specialties and traditional dishes
• Street food and markets
• Regional cuisine variations
• Local beverages and drinks
• Food experiences and cooking classes`;
    }
    
    return advice;
  };

  const generatePlanningResponse = (input) => {
    if (input.includes('day') || input.includes('schedule') || input.includes('itinerary')) {
      return "I can help you create a detailed day-by-day itinerary. Would you like me to generate a sample itinerary based on your preferences?";
    }
    
    if (input.includes('activity') || input.includes('do') || input.includes('see')) {
      return "There are many activities to consider for your trip. Based on your preferences, I'd recommend checking out local attractions, cultural experiences, and outdoor activities. Would you like specific recommendations?";
    }
    
    return "I'm here to help with your trip planning. What specific aspect of the itinerary would you like to focus on?";
  };

  const generateDetailsResponse = (input, topic) => {
    if (topic === 'budget') {
      if (input.includes('save') || input.includes('cheap') || input.includes('affordable')) {
        return "To save money on your trip, consider booking flights in advance, staying in budget accommodations, eating at local restaurants, using public transportation, and focusing on free activities. Would you like more specific budget tips?";
      }
      
      return "I can help you with budget planning for your trip. What's your approximate budget, and what aspects are most important to you?";
    }
    
    if (topic === 'accommodation') {
      if (input.includes('hotel') || input.includes('stay') || input.includes('room')) {
        return "For accommodations, I recommend checking reviews on trusted travel sites, booking in advance for better rates, and considering alternative options like Airbnb or boutique hotels. Would you like specific hotel recommendations?";
      }
      
      return "I can help you find the perfect accommodation for your trip. What type of place are you looking to stay at?";
    }
    
    if (topic === 'food') {
      if (input.includes('restaurant') || input.includes('eat') || input.includes('dining')) {
        return "For dining, I recommend trying local specialties, checking out food markets, and reading reviews from locals. Would you like specific restaurant recommendations?";
      }
      
      return "I can help you discover great food options for your trip. What type of cuisine are you interested in?";
    }
    
    return "I can help you with the details of your trip. What specific information are you looking for?";
  };

  const getDestinationSuggestions = (prefs) => {
    // Add destination suggestion logic based on preferences
    const suggestions = {
      beach: ['Bali', 'Maldives', 'Greek Islands'],
      mountain: ['Swiss Alps', 'Patagonia', 'Canadian Rockies'],
      city: ['Tokyo', 'New York', 'Barcelona'],
      adventure: ['New Zealand', 'Costa Rica', 'Iceland']
    };
    
    return suggestions[prefs.tripType]?.join(', ') || 'several amazing destinations';
  };

  return (
    <PlannerContainer>
      <ChatContainer>
        <ChatHeader>
          <ChatAvatar>🤖</ChatAvatar>
          <ChatTitle>TRIPZY AI Travel Assistant</ChatTitle>
        </ChatHeader>
        
        <ChatMessages>
          <AnimatePresence>
            {messages.map(message => (
              <Message
                key={message.id}
                isUser={message.isUser}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {message.text}
              </Message>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <TypingIndicator
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Dot
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
              />
              <Dot
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
              />
              <Dot
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
              />
            </TypingIndicator>
          )}
          
          <div ref={messagesEndRef} />
        </ChatMessages>
        
        <InputContainer>
          <Input
            type="text"
            placeholder="Ask about travel destinations, itineraries, or tips..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <SendButton
            onClick={handleSend}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ➤
          </SendButton>
        </InputContainer>
      </ChatContainer>
      
      <PreferencesContainer>
        <PreferenceSection>
          <PreferenceTitle>What type of trip are you planning?</PreferenceTitle>
          <PreferenceOptions>
            {['Beach', 'Mountain', 'City', 'Adventure'].map(type => (
              <PreferenceButton
                key={type}
                selected={preferences.tripType === type.toLowerCase()}
                onClick={() => handlePreferenceChange('tripType', type.toLowerCase())}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {type}
              </PreferenceButton>
            ))}
          </PreferenceOptions>
        </PreferenceSection>

        <PreferenceSection>
          <PreferenceTitle>What's your budget range?</PreferenceTitle>
          <BudgetInput
            type="number"
            placeholder="Enter your budget in USD"
            value={preferences.budget}
            onChange={(e) => handlePreferenceChange('budget', e.target.value)}
          />
        </PreferenceSection>

        <PreferenceSection>
          <PreferenceTitle>How long are you planning to travel?</PreferenceTitle>
          <PreferenceOptions>
            {['Weekend', '1 Week', '2 Weeks', '1 Month+'].map(duration => (
              <PreferenceButton
                key={duration}
                selected={preferences.duration === duration}
                onClick={() => handlePreferenceChange('duration', duration)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {duration}
              </PreferenceButton>
            ))}
          </PreferenceOptions>
        </PreferenceSection>

        <PreferenceSection>
          <PreferenceTitle>What are your interests?</PreferenceTitle>
          <PreferenceOptions>
            {['Culture', 'Food', 'Nature', 'Shopping', 'History', 'Adventure'].map(interest => (
              <PreferenceButton
                key={interest}
                selected={preferences.interests.includes(interest.toLowerCase())}
                onClick={() => handleInterestToggle(interest.toLowerCase())}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {interest}
              </PreferenceButton>
            ))}
          </PreferenceOptions>
        </PreferenceSection>

        <PreferenceSection>
          <PreferenceTitle>What's your travel style?</PreferenceTitle>
          <PreferenceOptions>
            {['Luxury', 'Comfort', 'Budget', 'Backpacking'].map(style => (
              <PreferenceButton
                key={style}
                selected={preferences.travelStyle === style.toLowerCase()}
                onClick={() => handlePreferenceChange('travelStyle', style.toLowerCase())}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {style}
              </PreferenceButton>
            ))}
          </PreferenceOptions>
        </PreferenceSection>
      </PreferencesContainer>

      <ToggleButton
        onClick={() => setShowItinerary(!showItinerary)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {showItinerary ? 'Hide Itinerary Builder' : 'Show Itinerary Builder'}
      </ToggleButton>

      {showItinerary && <ItineraryBuilder preferences={preferences} />}
    </PlannerContainer>
  );
};

export default AIPlanner; 