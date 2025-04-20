import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ChatContainer = styled(motion.div)`
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
`;

const ChatWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  gap: 20px;
  height: calc(100vh - 200px);
`;

const Sidebar = styled.div`
  width: 300px;
  background: ${({ theme, isDarkMode }) => isDarkMode ? '#2d2d2d' : 'white'};
  border-radius: 20px;
  padding: 20px;
  box-shadow: ${({ theme, isDarkMode }) => 
    isDarkMode 
      ? '0 10px 30px rgba(0, 0, 0, 0.3)'
      : '0 10px 30px rgba(0, 0, 0, 0.1)'
  };
  display: flex;
  flex-direction: column;
`;

const ChatArea = styled.div`
  flex: 1;
  background: ${({ theme, isDarkMode }) => isDarkMode ? '#2d2d2d' : 'white'};
  border-radius: 20px;
  padding: 20px;
  box-shadow: ${({ theme, isDarkMode }) => 
    isDarkMode 
      ? '0 10px 30px rgba(0, 0, 0, 0.3)'
      : '0 10px 30px rgba(0, 0, 0, 0.1)'
  };
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  color: ${({ theme, isDarkMode }) => isDarkMode ? '#fff' : '#333'};
  margin-bottom: 20px;
  font-size: 24px;
`;

const MemberList = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
`;

const MemberItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  background: ${({ theme, isDarkMode }) => isDarkMode ? '#3d3d3d' : '#f5f5f5'};
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(5px);
  }
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme, isDarkMode }) => isDarkMode ? '#4d4d4d' : '#e0e0e0'};
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme, isDarkMode }) => isDarkMode ? '#fff' : '#333'};
  font-weight: bold;
`;

const MemberName = styled.span`
  color: ${({ theme, isDarkMode }) => isDarkMode ? '#fff' : '#333'};
  font-size: 16px;
`;

const AddMemberButton = styled(motion.button)`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '+';
    font-size: 18px;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Message = styled.div`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 15px;
  background: ${({ isOwn, theme, isDarkMode }) => 
    isOwn 
      ? (isDarkMode ? '#4d4d4d' : theme.colors.primary)
      : (isDarkMode ? '#3d3d3d' : '#f0f0f0')
  };
  color: ${({ isOwn, isDarkMode }) => 
    isOwn 
      ? 'white'
      : (isDarkMode ? 'white' : '#333')
  };
  align-self: ${({ isOwn }) => isOwn ? 'flex-end' : 'flex-start'};
`;

const InputContainer = styled.div`
  display: flex;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid ${({ theme, isDarkMode }) => isDarkMode ? '#3d3d3d' : '#e0e0e0'};
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 12px;
  border-radius: 20px;
  border: 1px solid ${({ theme, isDarkMode }) => isDarkMode ? '#3d3d3d' : '#e0e0e0'};
  background: ${({ theme, isDarkMode }) => isDarkMode ? '#3d3d3d' : 'white'};
  color: ${({ theme, isDarkMode }) => isDarkMode ? 'white' : '#333'};
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SendButton = styled(motion.button)`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

const RemoveButton = styled(motion.button)`
  background: ${({ theme }) => theme.colors.error};
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  margin-left: auto;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${MemberItem}:hover & {
    opacity: 1;
  }
`;

const ConfirmationModal = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${({ theme, isDarkMode }) => isDarkMode ? '#2d2d2d' : 'white'};
  padding: 30px;
  border-radius: 15px;
  box-shadow: ${({ theme, isDarkMode }) => 
    isDarkMode 
      ? '0 10px 30px rgba(0, 0, 0, 0.3)'
      : '0 10px 30px rgba(0, 0, 0, 0.1)'
  };
  z-index: 1000;
  width: 90%;
  max-width: 400px;
`;

const ModalTitle = styled.h3`
  color: ${({ theme, isDarkMode }) => isDarkMode ? '#fff' : '#333'};
  margin-bottom: 20px;
  font-size: 20px;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const ModalButton = styled(motion.button)`
  padding: 8px 16px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  
  ${({ variant }) => variant === 'cancel' ? `
    background: ${({ theme, isDarkMode }) => isDarkMode ? '#3d3d3d' : '#f0f0f0'};
    color: ${({ theme, isDarkMode }) => isDarkMode ? '#fff' : '#333'};
  ` : `
    background: ${({ theme }) => theme.colors.error};
    color: white;
  `}
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${({ theme, isDarkMode }) => isDarkMode ? '#fff' : '#666'};
  text-align: center;
  padding: 20px;
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: 20px;
  opacity: 0.5;
`;

const EmptyStateText = styled.p`
  font-size: 16px;
  margin-bottom: 10px;
`;

const AddMemberModal = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${({ theme, isDarkMode }) => isDarkMode ? '#2d2d2d' : 'white'};
  padding: 30px;
  border-radius: 15px;
  box-shadow: ${({ theme, isDarkMode }) => 
    isDarkMode 
      ? '0 10px 30px rgba(0, 0, 0, 0.3)'
      : '0 10px 30px rgba(0, 0, 0, 0.1)'
  };
  z-index: 1000;
  width: 90%;
  max-width: 400px;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme, isDarkMode }) => isDarkMode ? '#3d3d3d' : '#e0e0e0'};
  background: ${({ theme, isDarkMode }) => isDarkMode ? '#3d3d3d' : 'white'};
  color: ${({ theme, isDarkMode }) => isDarkMode ? 'white' : '#333'};
  font-size: 16px;
  margin-bottom: 20px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const GroupChat = () => {
  const { isDarkMode } = useTheme();
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        text: newMessage,
        sender: 'You',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleAddMember = () => {
    if (newMemberName.trim()) {
      const newMember = {
        id: members.length + 1,
        name: newMemberName.trim(),
        avatar: newMemberName.trim().split(' ').map(n => n[0]).join('').toUpperCase(),
        role: members.length === 0 ? 'Organizer' : 'Member'
      };
      setMembers([...members, newMember]);
      setNewMemberName('');
      setShowAddMemberModal(false);
    }
  };

  const handleAddMemberClick = () => {
    setShowAddMemberModal(true);
  };

  const handleCancelAddMember = () => {
    setShowAddMemberModal(false);
    setNewMemberName('');
  };

  const handleRemoveClick = (member) => {
    setMemberToRemove(member);
    setShowConfirmation(true);
  };

  const handleConfirmRemove = () => {
    if (memberToRemove) {
      setMembers(members.filter(m => m.id !== memberToRemove.id));
      setShowConfirmation(false);
      setMemberToRemove(null);
    }
  };

  const handleCancelRemove = () => {
    setShowConfirmation(false);
    setMemberToRemove(null);
  };

  return (
    <ChatContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      isDarkMode={isDarkMode}
    >
      <ChatWrapper>
        <Sidebar isDarkMode={isDarkMode}>
          <Title isDarkMode={isDarkMode}>Group Members</Title>
          {members.length === 0 ? (
            <EmptyState isDarkMode={isDarkMode}>
              <EmptyStateIcon>👥</EmptyStateIcon>
              <EmptyStateText>No members yet</EmptyStateText>
              <EmptyStateText>Add members to start your group chat</EmptyStateText>
            </EmptyState>
          ) : (
            <MemberList>
              {members.map(member => (
                <MemberItem key={member.id} isDarkMode={isDarkMode}>
                  <Avatar isDarkMode={isDarkMode}>{member.avatar}</Avatar>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <MemberName isDarkMode={isDarkMode}>{member.name}</MemberName>
                    <span style={{ fontSize: '12px', opacity: 0.7, color: isDarkMode ? '#fff' : '#666' }}>
                      {member.role}
                    </span>
                  </div>
                  {member.role !== 'Organizer' && (
                    <RemoveButton
                      onClick={() => handleRemoveClick(member)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      ×
                    </RemoveButton>
                  )}
                </MemberItem>
              ))}
            </MemberList>
          )}
          <AddMemberButton
            onClick={handleAddMemberClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Member
          </AddMemberButton>
        </Sidebar>

        <ChatArea isDarkMode={isDarkMode}>
          <Title isDarkMode={isDarkMode}>Group Chat</Title>
          {messages.length === 0 ? (
            <EmptyState isDarkMode={isDarkMode}>
              <EmptyStateIcon>💬</EmptyStateIcon>
              <EmptyStateText>No messages yet</EmptyStateText>
              <EmptyStateText>Start the conversation by sending a message</EmptyStateText>
            </EmptyState>
          ) : (
            <MessagesContainer>
              {messages.map(message => (
                <Message
                  key={message.id}
                  isOwn={message.sender === 'You'}
                  isDarkMode={isDarkMode}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                    {message.sender}
                  </div>
                  <div>{message.text}</div>
                  <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '4px' }}>
                    {message.timestamp}
                  </div>
                </Message>
              ))}
              <div ref={messagesEndRef} />
            </MessagesContainer>
          )}
          <InputContainer isDarkMode={isDarkMode}>
            <form onSubmit={handleSendMessage} style={{ display: 'flex', flex: 1, gap: '10px' }}>
              <MessageInput
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                isDarkMode={isDarkMode}
              />
              <SendButton
                type="submit"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                →
              </SendButton>
            </form>
          </InputContainer>
        </ChatArea>
      </ChatWrapper>

      <AnimatePresence>
        {showAddMemberModal && (
          <>
            <Overlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancelAddMember}
            />
            <AddMemberModal
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              isDarkMode={isDarkMode}
            >
              <ModalTitle isDarkMode={isDarkMode}>
                Add New Member
              </ModalTitle>
              <ModalInput
                type="text"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Enter member name"
                isDarkMode={isDarkMode}
                autoFocus
              />
              <ModalButtons>
                <ModalButton
                  variant="cancel"
                  onClick={handleCancelAddMember}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </ModalButton>
                <ModalButton
                  onClick={handleAddMember}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add
                </ModalButton>
              </ModalButtons>
            </AddMemberModal>
          </>
        )}
        {showConfirmation && (
          <>
            <Overlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancelRemove}
            />
            <ConfirmationModal
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              isDarkMode={isDarkMode}
            >
              <ModalTitle isDarkMode={isDarkMode}>
                Remove Member
              </ModalTitle>
              <p style={{ color: isDarkMode ? '#fff' : '#333' }}>
                Are you sure you want to remove {memberToRemove?.name} from the group?
              </p>
              <ModalButtons>
                <ModalButton
                  variant="cancel"
                  onClick={handleCancelRemove}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </ModalButton>
                <ModalButton
                  onClick={handleConfirmRemove}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Remove
                </ModalButton>
              </ModalButtons>
            </ConfirmationModal>
          </>
        )}
      </AnimatePresence>
    </ChatContainer>
  );
};

export default GroupChat; 