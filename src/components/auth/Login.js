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
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { FiEye, FiEyeOff } from 'react-icons/fi';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
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

    try {
      const user = await login(formData);
      toast({
        title: 'Login successful',
        description: `Welcome back, ${user.name}!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      // Navigate to the attempted page or home
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error.message || 'Invalid email or password',
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
          <Heading size="xl">Welcome Back</Heading>
          <Text color="gray.600">Log in to your Splitwise account</Text>

          <VStack as="form" spacing={4} w="full" onSubmit={handleSubmit}>
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

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  pr="4.5rem"
                  placeholder="Enter your password"
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

            <Button
              type="submit"
              colorScheme="teal"
              w="full"
              isLoading={isLoading}
              loadingText="Logging in..."
            >
              Log in
            </Button>
          </VStack>

          <Text>
            Don't have an account?{' '}
            <Link as={RouterLink} to="/register" color="teal.500">
              Sign up
            </Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}

export default Login; 