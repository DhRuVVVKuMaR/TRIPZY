import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Styled Components
const ExpenseManagerContainer = styled.div`
  min-height: 100vh;
  padding: 100px 20px 40px;
  background: ${({ theme }) => theme.colors.background};
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Header = styled.div`
  background: ${({ theme }) => theme.colors.primary};
  padding: 1.5rem 2rem;
  color: white;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  opacity: 0.9;
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  padding: 2rem;
  background: #f5f5f5;
  border-right: 1px solid #eee;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    border-right: none;
    border-bottom: 1px solid #eee;
  }
`;

const MainContent = styled.div`
  padding: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

const Button = styled(motion.button)`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 600;
  width: 100%;
  margin-bottom: 1rem;
`;

const ExpenseList = styled.div`
  margin-top: 1.5rem;
`;

const ExpenseItem = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ExpenseDetails = styled.div``;

const ExpenseTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
`;

const ExpenseDate = styled.p`
  font-size: 0.9rem;
  color: #888;
`;

const ExpenseAmount = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.positive ? 'green' : 'red'};
`;

const ExpenseActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const DeleteButton = styled(motion.button)`
  background: #ff5a5a;
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
  
  &:hover {
    background: #ff3030;
  }
`;

const Form = styled.form`
  margin-top: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
`;

const BalanceSummary = styled.div`
  margin-top: 2rem;
  background: #f9f9f9;
  border-radius: 12px;
  padding: 1.5rem;
`;

const BalanceItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const BalanceName = styled.span``;

const BalanceAmount = styled.span`
  font-weight: 600;
  color: ${props => props.positive ? 'green' : 'red'};
`;

const MembersSection = styled.div`
  margin-top: 2rem;
`;

const MembersList = styled.div`
  margin-top: 1rem;
`;

const MemberItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const MemberName = styled.span`
  font-weight: 500;
`;

const RemoveMemberButton = styled(motion.button)`
  background: #ff5a5a;
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background 0.2s;
  
  &:hover {
    background: #ff3030;
  }
`;

const AddMemberForm = styled.form`
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
`;

const AddMemberInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
`;

const AddMemberButton = styled(motion.button)`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  font-weight: 600;
`;

// Mock data for initial development
const initialExpenses = [
  { id: 1, title: 'Dinner at Restaurant', amount: 120, paidBy: 'Alice', date: '2023-10-15', participants: ['Alice', 'Bob', 'Charlie'] },
  { id: 2, title: 'Taxi Ride', amount: 45, paidBy: 'Bob', date: '2023-10-16', participants: ['Alice', 'Bob'] },
  { id: 3, title: 'Museum Tickets', amount: 60, paidBy: 'Charlie', date: '2023-10-17', participants: ['Alice', 'Bob', 'Charlie'] }
];

const initialMembers = ['Alice', 'Bob', 'Charlie', 'You'];

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
      alert('Please fill in all required fields');
      return;
    }
    
    const newExpense = {
      id: expenses.length + 1,
      title: formData.title,
      amount: Number(formData.amount),
      paidBy: formData.paidBy,
      date: formData.date,
      participants: formData.participants
    };
    
    setExpenses([...expenses, newExpense]);
    
    // Reset form
    setFormData({
      title: '',
      amount: '',
      paidBy: 'You',
      date: new Date().toISOString().split('T')[0],
      participants: []
    });
  };
  
  const handleDeleteExpense = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setExpenses(expenses.filter(expense => expense.id !== id));
    }
  };
  
  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    
    // Check if member already exists
    if (members.includes(newMemberName.trim())) {
      alert('This person is already in the list');
      return;
    }
    
    setMembers([...members, newMemberName.trim()]);
    setNewMemberName('');
  };
  
  const handleRemoveMember = (memberToRemove) => {
    // Don't allow removing 'You'
    if (memberToRemove === 'You') return;
    
    // Check if member has any expenses
    const hasExpenses = expenses.some(expense => 
      expense.paidBy === memberToRemove || expense.participants.includes(memberToRemove)
    );
    
    if (hasExpenses) {
      alert('Cannot remove this person because they have expenses. Delete their expenses first.');
      return;
    }
    
    setMembers(members.filter(member => member !== memberToRemove));
  };
  
  return (
    <ExpenseManagerContainer>
      <Container>
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
                {members.map(member => (
                  <MemberItem key={member}>
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
              </MembersList>
            </MembersSection>
            
            <BalanceSummary>
              <SectionTitle>Your Balances</SectionTitle>
              {Object.entries(balances).filter(([name]) => name !== 'You').map(([name, amount]) => (
                <BalanceItem key={name}>
                  <BalanceName>{name}</BalanceName>
                  <BalanceAmount positive={amount < 0}>
                    {amount < 0 ? `You owe $${Math.abs(amount).toFixed(2)}` : `Owes you $${amount.toFixed(2)}`}
                  </BalanceAmount>
                </BalanceItem>
              ))}
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
                  <FormLabel>Split With (hold Ctrl/Cmd to select multiple)</FormLabel>
                  <FormSelect 
                    multiple 
                    name="participants" 
                    value={formData.participants} 
                    onChange={handleParticipantChange}
                    size="4"
                  >
                    {members.map(member => (
                      <option key={member} value={member}>{member}</option>
                    ))}
                  </FormSelect>
                </FormGroup>
                
                <Button 
                  as="input" 
                  type="submit" 
                  value="Add Expense"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                />
              </Form>
            </div>
            
            <ExpenseList>
              <SectionTitle>Recent Expenses</SectionTitle>
              {expenses.map(expense => (
                <ExpenseItem key={expense.id}>
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
            </ExpenseList>
          </MainContent>
        </ContentContainer>
      </Container>
    </ExpenseManagerContainer>
  );
};

export default ExpenseManager; 