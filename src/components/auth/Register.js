import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { auth } from '../../services/api';
import { FiEye, FiEyeOff } from 'react-icons/fi';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    username: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    try {
      // Register the user
      const { confirmPassword, ...registrationData } = formData;
      await auth.register(registrationData);

      // Log in the user
      const user = await login({
        email: formData.email,
        password: formData.password
      });

      toast({
        title: 'Account created successfully',
        description: `Welcome to Splitwise, ${user.name}!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: error.response?.data?.message || 'Could not create account',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" py="60px" px={4} bg="gray.50">
      <Box maxW="md" mx="auto" bg="white" rounded="lg" shadow="md" p={8}>
        <VStack spacing={6}>
          <Heading size="xl">Create Account</Heading>
          <Text color="gray.600">Sign up for Splitwise</Text>

          <VStack as="form" spacing={4} w="full" onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel>Full Name</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                isDisabled={isLoading}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                isDisabled={isLoading}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username (optional)"
                isDisabled={isLoading}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Mobile Number</FormLabel>
              <Input
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter your mobile number (optional)"
                isDisabled={isLoading}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  isDisabled={isLoading}
                />
                <InputRightElement width="4.5rem">
                  <IconButton
                    h="1.75rem"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    icon={showPassword ? <FiEyeOff /> : <FiEye />}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    isDisabled={isLoading}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <InputGroup>
                <Input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  isDisabled={isLoading}
                />
                <InputRightElement width="4.5rem">
                  <IconButton
                    h="1.75rem"
                    size="sm"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    icon={showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    isDisabled={isLoading}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Button
              type="submit"
              colorScheme="teal"
              w="full"
              isLoading={isLoading}
              loadingText="Creating account..."
            >
              Sign up
            </Button>
          </VStack>

          <Text>
            Already have an account?{' '}
            <Link as={RouterLink} to="/login" color="teal.500">
              Log in
            </Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}

export default Register; 