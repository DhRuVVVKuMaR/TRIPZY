import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ItineraryContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin-top: 20px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 20px;
  box-shadow: ${({ theme }) => theme.shadows.large};
  padding: 20px;
`;

const DayContainer = styled.div`
  margin-bottom: 20px;
  border: 1px solid ${({ theme }) => theme.colors.gray.medium};
  border-radius: 10px;
  padding: 15px;
  background: ${({ theme }) => theme.colors.white};
  transition: all 0.3s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const DayHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.gray.light};
`;

const DayTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.secondary};
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: '📅';
    font-size: 1.2em;
  }
`;

const ActivityList = styled.div`
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
  background: white;
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

  &:hover {
    transform: translateX(5px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const ActivityDetails = styled.div`
  flex: 1;
`;

const ActivityTime = styled.span`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  margin-right: 10px;
`;

const ActivityTitle = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary};
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

  &::before {
    content: '+';
    font-size: 1.2em;
  }
`;

const ActivityModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: ${({ theme }) => theme.shadows.large};
  z-index: 1000;
  width: 90%;
  max-width: 500px;
`;

const ModalTitle = styled.h3`
  color: ${({ theme }) => theme.colors.secondary};
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

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
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

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
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
  
  ${({ variant }) => variant === 'cancel' ? `
    background: ${({ theme }) => theme.colors.gray.light};
    color: ${({ theme }) => theme.colors.secondary};
    border: none;
  ` : `
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    border: none;
  `}
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
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
    <ItineraryContainer>
      {itinerary.length === 0 ? (
        <AddActivityButton
          onClick={initializeItinerary}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Create Itinerary
        </AddActivityButton>
      ) : (
        itinerary.map((day, index) => (
          <DayContainer key={index}>
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
              {day.activities.map((activity, activityIndex) => (
                <ActivityItem
                  key={activity.id}
                  draggable
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
            </ActivityList>
          </DayContainer>
        ))
      )}

      {showModal && (
        <>
          <ModalOverlay onClick={() => setShowModal(false)} />
          <ActivityModal>
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
    </ItineraryContainer>
  );
};

export default ItineraryBuilder; 