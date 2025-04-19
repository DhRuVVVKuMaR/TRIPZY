import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Styled Components
const ExpenseManagerContainer = styled.div`
  min-height: 100vh;
  margin-top: 64px;
  padding: 20px;
  background: ${({ theme }) => theme.colors.background};
  background-image: linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%), url('/images/expense-bg.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  position: relative;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    margin-top: 56px;
    padding: 16px;
  }
`;

const Container = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.gray.light};
  border-radius: 24px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid ${({ theme }) => theme.colors.gray.medium};
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  padding: 1.5rem;
  color: white;
  position: relative;
  overflow: hidden;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 1.25rem;
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('/images/pattern.png');
    opacity: 0.1;
    z-index: 0;
  }
`;

const Title = styled.h1`
  font-size: 2.25rem;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 1;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 1.75rem;
    margin-bottom: 0.25rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  position: relative;
  z-index: 1;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 1rem;
  }
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 350px 1fr;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const Sidebar = styled.div`
  padding: 2rem;
  background: ${({ theme }) => theme.colors.gray.light};
  border-right: 1px solid ${({ theme }) => theme.colors.gray.medium};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 1.5rem;
    border-right: none;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray.medium};
  }
`;

const MainContent = styled.div`
  padding: 2rem;
  background: ${({ theme }) => theme.colors.gray.light};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 1.5rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.text || '#2d3436'};
  position: relative;
  padding-bottom: 0.5rem;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50px;
    height: 3px;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 3px;
  }
`;

const Button = styled(motion.button)`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 600;
  width: 100%;
  margin-bottom: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transform: translateX(-100%);
    transition: transform 0.6s;
  }
  
  &:hover:before {
    transform: translateX(100%);
  }
`;

const ExpenseList = styled.div`
  margin-top: 1.5rem;
`;

const ExpenseItem = styled(motion.div)`
  padding: 1.2rem;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.gray.medium};
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  &:hover {
    background: ${({ theme }) => theme.colors.gray.medium};
    transform: translateX(5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ExpenseDetails = styled.div`
  flex: 1;
  min-width: 0;
  color: ${({ theme }) => theme.colors.text || '#2d3436'};
`;

const ExpenseTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text || '#2d3436'};
  word-break: break-word;
`;

const ExpenseDate = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textLight || '#636e72'};
  margin: 0;
`;

const ExpenseAmount = styled.span`
  font-size: 1.3rem;
  font-weight: 600;
  color: ${props => props.positive ? '#4CAF50' : '#FF5252'};
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
  white-space: nowrap;
`;

const ExpenseActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
`;

const DeleteButton = styled(motion.button)`
  background: rgba(255, 82, 82, 0.8);
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  
  &:hover {
    background: #FF5252;
    transform: scale(1.1);
  }
`;

const Form = styled.form`
  margin-top: 1.5rem;
  background: ${({ theme }) => theme.colors.background};
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.gray.medium};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text || '#2d3436'};
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.gray.medium};
  border-radius: 8px;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text || '#2d3436'};
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight || '#636e72'};
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.gray.medium};
  border-radius: 8px;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text || '#2d3436'};
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
  }
  
  option {
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text || '#2d3436'};
  }
`;

const BalanceSummary = styled.div`
  margin-top: 2rem;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid ${({ theme }) => theme.colors.gray.medium};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const BalanceItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray.medium};
  
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const BalanceName = styled.span`
  color: ${({ theme }) => theme.colors.text || '#2d3436'};
  font-weight: 500;
`;

const BalanceAmount = styled.span`
  font-weight: 600;
  color: ${props => props.positive ? '#4CAF50' : '#FF5252'};
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
`;

const MembersSection = styled.div`
  margin-top: 2rem;
`;

const MembersList = styled.div`
  margin-top: 1rem;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.gray.medium};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const MemberItem = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray.medium};
  color: ${({ theme }) => theme.colors.text || '#2d3436'};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: ${({ theme }) => theme.colors.gray.light};
  }
`;

const MemberName = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text || '#2d3436'};
`;

const RemoveMemberButton = styled(motion.button)`
  background: rgba(255, 82, 82, 0.8);
  color: white;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: #FF5252;
    transform: scale(1.1);
  }
`;

const AddMemberForm = styled.form`
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
`;

const AddMemberInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.gray.medium};
  border-radius: 8px;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text || '#2d3436'};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight || '#636e72'};
  }
`;

const AddMemberButton = styled(motion.button)`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  color: white;
  border: none;
  padding: 0.75rem 1.2rem;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const StatsWrapper = styled.div`
  position: relative;
  margin: 2rem 0;
  overflow: hidden;
  padding: 0.5rem 0;
`;

const StatsContainer = styled(motion.div)`
  display: flex;
  gap: 1.5rem;
  padding: 0 calc(50% - 100px);
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
`;

const StatCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.background};
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.colors.gray.medium};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  flex: 0 0 200px;
  opacity: ${props => props.isActive ? 1 : 0.5};
  transform: scale(${props => props.isActive ? 1 : 0.9});
  transition: all 0.3s ease;
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text || '#2d3436'};
  margin-bottom: 0.75rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textLight || '#636e72'};
`;

const DotIndicator = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const Dot = styled.button`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: ${props => props.active ? 
    ({ theme }) => theme.colors.primary || '#00b894' : 
    'rgba(0, 0, 0, 0.1)'
  };
  cursor: pointer;
  padding: 0;
  transition: all 0.3s ease;
  transform: scale(${props => props.active ? 1.2 : 1});
  
  &:hover {
    transform: scale(1.3);
    background: ${props => props.active ? 
      ({ theme }) => theme.colors.primary || '#00b894' : 
      'rgba(0, 0, 0, 0.2)'
    };
  }
`;

// Remove mock data and initialize with empty arrays
const initialExpenses = [];
const initialMembers = ['You'];

const ExpenseManager = () => {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [members, setMembers] = useState(initialMembers);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    paidBy: 'You',
    date: new Date().toISOString().split('T')[0],
    participants: []
  });
  const [balances, setBalances] = useState({});
  const [newMemberName, setNewMemberName] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const statsContainerRef = useRef(null);
  
  // Calculate balances between members
  useEffect(() => {
    const newBalances = {};
    members.forEach(member => {
      newBalances[member] = 0;
    });
    
    expenses.forEach(expense => {
      const payer = expense.paidBy;
      const amount = expense.amount;
      const splitAmount = amount / expense.participants.length;
      
      expense.participants.forEach(participant => {
        if (participant !== payer) {
          newBalances[participant] -= splitAmount;
          newBalances[payer] += splitAmount;
        }
      });
    });
    
    setBalances(newBalances);
  }, [expenses, members]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleParticipantChange = (e) => {
    const { options } = e.target;
    const selectedParticipants = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedParticipants.push(options[i].value);
      }
    }
    setFormData({
      ...formData,
      participants: selectedParticipants
    });
  };
  
  const handleAddExpense = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.amount || formData.participants.length === 0) {
      return;
    }
    
    const newExpense = {
      id: Date.now(),
      title: formData.title,
      amount: parseFloat(formData.amount),
      paidBy: formData.paidBy,
      date: formData.date,
      participants: formData.participants
    };
    
    setExpenses([newExpense, ...expenses]);
    
    setFormData({
      title: '',
      amount: '',
      paidBy: 'You',
      date: new Date().toISOString().split('T')[0],
      participants: []
    });
  };
  
  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };
  
  const handleAddMember = (e) => {
    e.preventDefault();
    
    if (!newMemberName.trim()) {
      return;
    }
    
    if (members.includes(newMemberName)) {
      return;
    }
    
    setMembers([...members, newMemberName]);
    setNewMemberName('');
  };
  
  const handleRemoveMember = (memberToRemove) => {
    if (memberToRemove === 'You') {
      return;
    }
    
    setMembers(members.filter(member => member !== memberToRemove));
  };
  
  // Calculate total expenses
  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
  
  // Calculate average expense
  const averageExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;
  
  // Calculate number of expenses
  const expenseCount = expenses.length;
  
  const stats = [
    {
      value: totalExpenses.toFixed(2),
      label: 'Total Expenses',
      prefix: '$'
    },
    {
      value: averageExpense.toFixed(2),
      label: 'Average Expense',
      prefix: '$'
    },
    {
      value: expenseCount,
      label: 'Number of Expenses',
      prefix: ''
    }
  ];

  const handleDragEnd = (event, info) => {
    const threshold = 50;
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    
    if (offset > threshold || velocity > 500) {
      // Swipe right
      setCurrentPage(Math.max(0, currentPage - 1));
    } else if (offset < -threshold || velocity < -500) {
      // Swipe left
      setCurrentPage(Math.min(stats.length - 1, currentPage + 1));
    }
  };

  const handleDotClick = (index) => {
    setCurrentPage(index);
  };

  // Calculate the x position to center the active card
  const calculateX = () => {
    if (!statsContainerRef.current) return 0;
    const cardWidth = 200; // Same as flex-basis
    const gap = 24; // 1.5rem gap
    return -(currentPage * (cardWidth + gap));
  };
  
  return (
    <ExpenseManagerContainer>
      <Container
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Header>
          <Title>Expense Manager</Title>
          <Subtitle>Split expenses with your travel companions</Subtitle>
        </Header>
        
        <ContentContainer>
          <Sidebar>
            <SectionTitle>Trip Expenses</SectionTitle>
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add New Expense
            </Button>
            
            <StatsWrapper>
              <StatsContainer
                ref={statsContainerRef}
                drag="x"
                dragConstraints={statsContainerRef}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                animate={{
                  x: calculateX()
                }}
                transition={{
                  type: "spring",
                  damping: 30,
                  stiffness: 200
                }}
              >
                {stats.map((stat, index) => (
                  <StatCard
                    key={stat.label}
                    isActive={currentPage === index}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <StatValue>{stat.prefix}{stat.value}</StatValue>
                    <StatLabel>{stat.label}</StatLabel>
                  </StatCard>
                ))}
              </StatsContainer>
              
              <DotIndicator>
                {stats.map((_, index) => (
                  <Dot
                    key={index}
                    active={currentPage === index}
                    onClick={() => handleDotClick(index)}
                  />
                ))}
              </DotIndicator>
            </StatsWrapper>
            
            <MembersSection>
              <SectionTitle>Members</SectionTitle>
              <AddMemberForm onSubmit={handleAddMember}>
                <AddMemberInput
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Add new member"
                />
                <AddMemberButton
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add
                </AddMemberButton>
              </AddMemberForm>
              
              <MembersList>
                <AnimatePresence>
                  {members.map(member => (
                    <MemberItem 
                      key={member}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <MemberName>{member}</MemberName>
                      {member !== 'You' && (
                        <RemoveMemberButton
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRemoveMember(member)}
                        >
                          ✕
                        </RemoveMemberButton>
                      )}
                    </MemberItem>
                  ))}
                </AnimatePresence>
              </MembersList>
            </MembersSection>
            
            <BalanceSummary>
              <SectionTitle>Your Balances</SectionTitle>
              <AnimatePresence>
                {Object.entries(balances).filter(([name]) => name !== 'You').map(([name, amount]) => (
                  <BalanceItem 
                    key={name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <BalanceName>{name}</BalanceName>
                    <BalanceAmount positive={amount < 0}>
                      {amount < 0 ? `You owe $${Math.abs(amount).toFixed(2)}` : `Owes you $${amount.toFixed(2)}`}
                    </BalanceAmount>
                  </BalanceItem>
                ))}
              </AnimatePresence>
            </BalanceSummary>
          </Sidebar>
          
          <MainContent>
            <div>
              <SectionTitle>Add New Expense</SectionTitle>
              <Form onSubmit={handleAddExpense}>
                <FormGroup>
                  <FormLabel>Title</FormLabel>
                  <FormInput 
                    type="text" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleInputChange}
                    placeholder="e.g., Dinner, Hotel, Taxi"
                  />
                </FormGroup>
                
                <FormGroup>
                  <FormLabel>Amount ($)</FormLabel>
                  <FormInput 
                    type="number" 
                    name="amount" 
                    value={formData.amount} 
                    onChange={handleInputChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </FormGroup>
                
                <FormGroup>
                  <FormLabel>Paid By</FormLabel>
                  <FormSelect name="paidBy" value={formData.paidBy} onChange={handleInputChange}>
                    {members.map(member => (
                      <option key={member} value={member}>{member}</option>
                    ))}
                  </FormSelect>
                </FormGroup>
                
                <FormGroup>
                  <FormLabel>Date</FormLabel>
                  <FormInput 
                    type="date" 
                    name="date" 
                    value={formData.date} 
                    onChange={handleInputChange}
                  />
                </FormGroup>
                
                <FormGroup>
                  <FormLabel>Participants</FormLabel>
                  <FormSelect 
                    name="participants" 
                    multiple 
                    value={formData.participants} 
                    onChange={handleParticipantChange}
                    style={{ height: '120px' }}
                  >
                    {members.map(member => (
                      <option key={member} value={member}>{member}</option>
                    ))}
                  </FormSelect>
                </FormGroup>
                
                <Button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add Expense
                </Button>
              </Form>
            </div>
            
            <ExpenseList>
              <SectionTitle>Recent Expenses</SectionTitle>
              <AnimatePresence>
                {expenses.map(expense => (
                  <ExpenseItem 
                    key={expense.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ExpenseDetails>
                      <ExpenseTitle>{expense.title}</ExpenseTitle>
                      <ExpenseDate>{expense.date} • Paid by {expense.paidBy}</ExpenseDate>
                    </ExpenseDetails>
                    <ExpenseActions>
                      <ExpenseAmount positive={expense.paidBy === 'You'}>
                        ${expense.amount.toFixed(2)}
                      </ExpenseAmount>
                      <DeleteButton
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteExpense(expense.id)}
                      >
                        ✕
                      </DeleteButton>
                    </ExpenseActions>
                  </ExpenseItem>
                ))}
              </AnimatePresence>
            </ExpenseList>
          </MainContent>
        </ContentContainer>
      </Container>
    </ExpenseManagerContainer>
  );
};

export default ExpenseManager; 