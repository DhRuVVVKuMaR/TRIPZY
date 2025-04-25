import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import emailjs from '@emailjs/browser';

const WaitlistContainer = styled.div`
  min-height: 100vh;
  padding: 120px 20px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${props => props.theme.colors.background};
`;

const FormContainer = styled(motion.div)`
  max-width: 600px;
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

const Select = styled.select`
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
    travelFrequency: '',
    budgetRange: '',
    preferredDestinations: '',
    travelInterests: '',
    specialRequirements: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize EmailJS once when component mounts
  useEffect(() => {
    try {
      emailjs.init(process.env.REACT_APP_EMAILJS_USER_ID);
      console.log('EmailJS initialized successfully');
    } catch (error) {
      console.error('EmailJS initialization error:', error);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Add validation function
  const validateFormData = (data) => {
    const errors = [];
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email.trim())) {
      errors.push('Please enter a valid email address');
    }

    // Name validation
    if (!data.name || data.name.trim().length < 2) {
      errors.push('Please enter a valid name (minimum 2 characters)');
    }

    // Phone validation
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!data.phone || !phoneRegex.test(data.phone.trim())) {
      errors.push('Please enter a valid phone number');
    }

    // Required fields validation
    if (!data.travelFrequency) errors.push('Please select travel frequency');
    if (!data.budgetRange) errors.push('Please select budget range');
    if (!data.preferredDestinations) errors.push('Please enter preferred destinations');
    if (!data.travelInterests) errors.push('Please enter travel interests');

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      // Basic validation
      if (!formData.email || !formData.email.trim()) {
        throw new Error('Email address is required');
      }

      if (!formData.name || !formData.name.trim()) {
        throw new Error('Name is required');
      }

      // First store in Firestore
      if (!db) {
        throw new Error('Database connection error');
      }

      const docRef = await addDoc(collection(db, 'waitlist'), {
        ...formData,
        timestamp: new Date(),
      });

      console.log('Data stored in Firestore:', docRef.id);

      // Prepare email template parameters - matching your template exactly
      const templateParams = {
        email: formData.email.trim(),
        subject: "Welcome to Tripzy - Let's Get Started!",
        from_name: 'Tripzy Support Team',
        to_name: formData.name.trim(),
        reply_to: 'tripzyyy2318@gmail.com',
        message: `Welcome to the Tripzy family! We're excited to have you on board.

Your account has been successfully created, and you're now ready to explore all the great features we offer.

Travel Preferences:
- Travel Frequency: ${formData.travelFrequency}
- Budget Range: ${formData.budgetRange}
- Preferred Destinations: ${formData.preferredDestinations}
- Travel Interests: ${formData.travelInterests}
${formData.specialRequirements ? `- Special Requirements: ${formData.specialRequirements}` : ''}

If you have any questions or need help getting started, our support team is just an email away at tripzyyy2318@gmail.com.

Best regards,
The Tripzy Team`
      };

      // Log the exact parameters being sent
      console.log('EmailJS Parameters:', {
        serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID,
        templateId: process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        publicKey: process.env.REACT_APP_EMAILJS_USER_ID ? 'Present' : 'Missing',
        templateParams
      });

      // Verify environment variables
      if (!process.env.REACT_APP_EMAILJS_SERVICE_ID ||
          !process.env.REACT_APP_EMAILJS_TEMPLATE_ID ||
          !process.env.REACT_APP_EMAILJS_USER_ID) {
        console.error('Missing EmailJS configuration:', {
          serviceId: !!process.env.REACT_APP_EMAILJS_SERVICE_ID,
          templateId: !!process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
          publicKey: !!process.env.REACT_APP_EMAILJS_USER_ID
        });
        throw new Error('Missing EmailJS configuration. Please check your environment variables.');
      }

      // Send email using promise-based approach with more detailed error handling
      const emailResult = await emailjs.send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        templateParams
      ).then(
        (response) => {
          console.log('EmailJS Success Response:', response);
          return response;
        },
        (error) => {
          console.error('EmailJS Error Details:', {
            error: error,
            message: error.message,
            status: error.status,
            text: error.text,
            name: error.name,
            templateParams: templateParams // Log the params that caused the error
          });
          throw error;
        }
      );

      setStatus({
        type: 'success',
        message: "Thank you for joining our waitlist! We've sent you a confirmation email.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        travelFrequency: '',
        budgetRange: '',
        preferredDestinations: '',
        travelInterests: '',
        specialRequirements: ''
      });
    } catch (error) {
      console.error('Form submission error:', {
        message: error.message,
        status: error.status,
        text: error.text
      });
      
      let errorMessage = 'Something went wrong. Please try again later.';
      
      if (error.message?.includes('configuration')) {
        errorMessage = 'Email service is not properly configured. Please contact support.';
      } else if (error.status === 400) {
        errorMessage = 'The email service received invalid information. Please try again.';
      } else if (error.status === 401 || error.status === 403) {
        errorMessage = 'Email service authentication failed. Please contact support.';
      } else if (error.status === 404) {
        errorMessage = 'Email template not found. Please contact support.';
      } else if (error.status === 422) {
        errorMessage = 'Please check your email address and try again.';
      } else if (error.status >= 500) {
        errorMessage = 'Email service is temporarily unavailable. Please try again later.';
      }
      
      setStatus({
        type: 'error',
        message: errorMessage
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
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              title="Please enter a valid email address"
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

          <InputGroup>
            <Label htmlFor="travelFrequency">How often do you travel?</Label>
            <Select
              id="travelFrequency"
              name="travelFrequency"
              value={formData.travelFrequency}
              onChange={handleChange}
              required
            >
              <option value="">Select frequency</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Bi-annually">Bi-annually</option>
              <option value="Annually">Annually</option>
              <option value="Rarely">Rarely</option>
            </Select>
          </InputGroup>

          <InputGroup>
            <Label htmlFor="budgetRange">What's your typical travel budget?</Label>
            <Select
              id="budgetRange"
              name="budgetRange"
              value={formData.budgetRange}
              onChange={handleChange}
              required
            >
              <option value="">Select budget range</option>
              <option value="Budget ($0-$1000)">Budget ($0-$1000)</option>
              <option value="Mid-range ($1000-$3000)">Mid-range ($1000-$3000)</option>
              <option value="Luxury ($3000+)">Luxury ($3000+)</option>
            </Select>
          </InputGroup>

          <InputGroup>
            <Label htmlFor="preferredDestinations">Preferred Destinations</Label>
            <Input
              type="text"
              id="preferredDestinations"
              name="preferredDestinations"
              value={formData.preferredDestinations}
              onChange={handleChange}
              placeholder="e.g., Europe, Asia, Beach destinations"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="travelInterests">Travel Interests</Label>
            <Input
              type="text"
              id="travelInterests"
              name="travelInterests"
              value={formData.travelInterests}
              onChange={handleChange}
              placeholder="e.g., Adventure, Culture, Food, Relaxation"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="specialRequirements">Special Requirements (Optional)</Label>
            <Input
              type="text"
              id="specialRequirements"
              name="specialRequirements"
              value={formData.specialRequirements}
              onChange={handleChange}
              placeholder="e.g., Dietary restrictions, Accessibility needs"
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