import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const WaitlistContainer = styled.div`
  min-height: 100vh;
  padding: 120px 20px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${props => props.theme.colors.background};
`;

const FormContainer = styled(motion.div)`
  max-width: 500px;
  width: 100%;
  padding: 2rem;
  background: ${props => props.theme.colors.gray.light};
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.theme.colors.gray.medium};
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text};
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.text};
  opacity: 0.8;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 2px solid ${props => props.theme.colors.gray.medium};
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SubmitButton = styled(motion.button)`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
`;

const SuccessMessage = styled(motion.div)`
  color: ${props => props.theme.colors.primary};
  text-align: center;
  margin-top: 1rem;
  font-weight: 500;
`;

const ErrorMessage = styled(motion.div)`
  color: red;
  text-align: center;
  margin-top: 1rem;
  font-weight: 500;
`;

const Waitlist = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      console.log('Attempting to add to waitlist:', formData);
      const docRef = await addDoc(collection(db, 'waitlist'), {
        ...formData,
        timestamp: new Date(),
      });
      console.log('Document written with ID:', docRef.id);

      setStatus({
        type: 'success',
        message: "Thank you for joining our waitlist! We'll be in touch soon.",
      });
      setFormData({ name: '', email: '', phone: '' });
    } catch (error) {
      console.error('Error adding to waitlist:', error);
      setStatus({
        type: 'error',
        message: error.message || 'Something went wrong. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <WaitlistContainer>
      <FormContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title>Join the Waitlist</Title>
        <Subtitle>
          Be among the first to experience TRIPZY when we launch.
        </Subtitle>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="name">Full Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="email">Email Address</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <SubmitButton
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? 'Submitting...' : 'Join Waitlist'}
          </SubmitButton>

          {status.type === 'success' && (
            <SuccessMessage
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {status.message}
            </SuccessMessage>
          )}

          {status.type === 'error' && (
            <ErrorMessage
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {status.message}
            </ErrorMessage>
          )}
        </Form>
      </FormContainer>
    </WaitlistContainer>
  );
};

export default Waitlist; 