import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const ItineraryContainer = styled(motion.div)`
  width: 100%;
  max-width: 800px;
  margin-top: 20px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 20px;
  box-shadow: ${({ theme }) => theme.shadows.large};
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.gray.medium};
`;

const DayContainer = styled(motion.div)`
  margin-bottom: 20px;
  border: 1px solid ${({ theme }) => theme.colors.gray.medium};
  border-radius: 10px;
  padding: 15px;
  background: ${({ theme }) => theme.colors.background};
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.medium};
    transform: translateY(-2px);
  }
`;

const DayHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.gray.light};
  position: relative;
  min-height: 50px;
`;

const DayTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 10px;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);

  &::before {
    content: '📅';
    font-size: 1.2em;
  }
`;

const ActivityList = styled(motion.div)`
  min-height: 100px;
  padding: 10px;
  background: ${({ theme }) => theme.colors.gray.light};
  border-radius: 5px;
  transition: all 0.3s ease;

  &:empty {
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.gray.medium};
    font-style: italic;
    
    &::after {
      content: 'Drag and drop activities here';
    }
  }
`;

const ActivityItem = styled(motion.div)`
  background: ${({ theme }) => theme.colors.background};
  padding: 15px;
  margin-bottom: 8px;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.small};
  cursor: move;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${({ theme }) => theme.colors.primary};
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateX(5px);
    box-shadow: ${({ theme }) => theme.shadows.medium};

    &::before {
      opacity: 0.05;
    }
  }
`;

const ActivityDetails = styled.div`
  flex: 1;
  z-index: 1;
`;

const ActivityTime = styled.span`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  margin-right: 10px;
`;

const ActivityTitle = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const ActivityLocation = styled.div`
  font-size: 0.9em;
  color: ${({ theme }) => theme.colors.gray.medium};
  margin-top: 5px;
`;

const ActivityDescription = styled.div`
  font-size: 0.9em;
  color: ${({ theme }) => theme.colors.gray.medium};
  margin-top: 5px;
`;

const AddActivityButton = styled(motion.button)`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9em;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;

  &::before {
    content: '+';
    font-size: 1.2em;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: white;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::after {
    opacity: 0.2;
  }
`;

const ActivityModal = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${({ theme }) => theme.colors.background};
  padding: 30px;
  border-radius: 15px;
  box-shadow: ${({ theme }) => theme.shadows.large};
  z-index: 1000;
  width: 90%;
  max-width: 500px;
  border: 1px solid ${({ theme }) => theme.colors.gray.medium};
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const ModalTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 20px;
  font-size: ${({ theme }) => theme.fontSizes.large};
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 2px solid ${({ theme }) => theme.colors.gray.medium};
  border-radius: 8px;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  transition: all 0.3s ease;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}33;
  }
`;

const ModalTextarea = styled.textarea`
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 2px solid ${({ theme }) => theme.colors.gray.medium};
  border-radius: 8px;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  min-height: 100px;
  resize: vertical;
  transition: all 0.3s ease;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}33;
  }
`;

const ModalButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const ModalButton = styled(motion.button)`
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  position: relative;
  overflow: hidden;
  
  ${({ variant }) => variant === 'cancel' ? `
    background: ${({ theme }) => theme.colors.gray.light};
    color: ${({ theme }) => theme.colors.text};
    border: none;
  ` : `
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    border: none;
  `}

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: white;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::after {
    opacity: 0.2;
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ItineraryBuilder = ({ preferences }) => {
  const [itinerary, setItinerary] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [newActivity, setNewActivity] = useState({
    title: '',
    time: '',
    description: '',
    location: ''
  });

  const initializeItinerary = () => {
    const days = parseInt(preferences.duration) || 1;
    const newItinerary = Array.from({ length: days }, (_, index) => ({
      day: index + 1,
      activities: []
    }));
    setItinerary(newItinerary);
  };

  const handleAddActivity = (dayIndex) => {
    setSelectedDay(dayIndex);
    setShowModal(true);
  };

  const handleSaveActivity = () => {
    if (selectedDay !== null) {
      setItinerary(prev => {
        const newItinerary = [...prev];
        newItinerary[selectedDay].activities.push({
          ...newActivity,
          id: Date.now()
        });
        return newItinerary;
      });
      setShowModal(false);
      setNewActivity({
        title: '',
        time: '',
        description: '',
        location: ''
      });
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceDay = parseInt(source.droppableId);
    const destDay = parseInt(destination.droppableId);

    setItinerary(prev => {
      const newItinerary = [...prev];
      const [removed] = newItinerary[sourceDay].activities.splice(source.index, 1);
      newItinerary[destDay].activities.splice(destination.index, 0, removed);
      return newItinerary;
    });
  };

  return (
    <ItineraryContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {itinerary.length === 0 ? (
        <AddActivityButton
          onClick={initializeItinerary}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Create Itinerary
        </AddActivityButton>
      ) : (
        <AnimatePresence>
          {itinerary.map((day, index) => (
            <DayContainer
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <DayHeader>
                <DayTitle>Day {day.day}</DayTitle>
                <AddActivityButton
                  onClick={() => handleAddActivity(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add Activity
                </AddActivityButton>
              </DayHeader>
              <ActivityList>
                <AnimatePresence>
                  {day.activities.map((activity, activityIndex) => (
                    <ActivityItem
                      key={activity.id}
                      draggable
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: activityIndex * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ActivityDetails>
                        <div>
                          <ActivityTime>{activity.time}</ActivityTime>
                          <ActivityTitle>{activity.title}</ActivityTitle>
                        </div>
                        <ActivityLocation>{activity.location}</ActivityLocation>
                        <ActivityDescription>{activity.description}</ActivityDescription>
                      </ActivityDetails>
                    </ActivityItem>
                  ))}
                </AnimatePresence>
              </ActivityList>
            </DayContainer>
          ))}
        </AnimatePresence>
      )}

      <AnimatePresence>
        {showModal && (
          <>
            <ModalOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            />
            <ActivityModal
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalTitle>Add New Activity</ModalTitle>
              <ModalInput
                type="text"
                placeholder="Activity Title"
                value={newActivity.title}
                onChange={(e) => setNewActivity(prev => ({ ...prev, title: e.target.value }))}
              />
              <ModalInput
                type="time"
                value={newActivity.time}
                onChange={(e) => setNewActivity(prev => ({ ...prev, time: e.target.value }))}
              />
              <ModalInput
                type="text"
                placeholder="Location"
                value={newActivity.location}
                onChange={(e) => setNewActivity(prev => ({ ...prev, location: e.target.value }))}
              />
              <ModalTextarea
                placeholder="Description"
                value={newActivity.description}
                onChange={(e) => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
              />
              <ModalButtonGroup>
                <ModalButton
                  variant="cancel"
                  onClick={() => setShowModal(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </ModalButton>
                <ModalButton
                  onClick={handleSaveActivity}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Save Activity
                </ModalButton>
              </ModalButtonGroup>
            </ActivityModal>
          </>
        )}
      </AnimatePresence>
    </ItineraryContainer>
  );
};

export default ItineraryBuilder; 