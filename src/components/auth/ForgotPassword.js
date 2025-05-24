import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
  PinInput,
  PinInputField,
  HStack,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSendOtp = () => {
    if (!mobileNumber) {
      toast({
        title: 'Error',
        description: 'Please enter your mobile number',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // TODO: Implement OTP sending logic
    setStep(2);
    toast({
      title: 'OTP Sent',
      description: 'Please check your mobile for OTP',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleVerifyOtp = () => {
    if (!otp) {
      toast({
        title: 'Error',
        description: 'Please enter the OTP',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // TODO: Implement OTP verification logic
    setStep(3);
  };

  const handleResetPassword = () => {
    if (!newPassword || !confirmPassword) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // TODO: Implement password reset logic
    toast({
      title: 'Success',
      description: 'Password has been reset successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    navigate('/login');
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius={8}>
      <VStack spacing={4}>
        <Text fontSize="2xl" fontWeight="bold">Reset Password</Text>

        {step === 1 && (
          <>
            <FormControl isRequired>
              <FormLabel>Mobile Number</FormLabel>
              <Input
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Enter your mobile number"
              />
            </FormControl>

            <Button
              colorScheme="blue"
              width="full"
              onClick={handleSendOtp}
            >
              Send OTP
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <FormControl isRequired>
              <FormLabel>Enter OTP</FormLabel>
              <HStack justify="center">
                <PinInput value={otp} onChange={setOtp}>
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                </PinInput>
              </HStack>
            </FormControl>

            <Button
              colorScheme="blue"
              width="full"
              onClick={handleVerifyOtp}
            >
              Verify OTP
            </Button>
          </>
        )}

        {step === 3 && (
          <>
            <FormControl isRequired>
              <FormLabel>New Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Confirm New Password</FormLabel>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </FormControl>

            <Button
              colorScheme="blue"
              width="full"
              onClick={handleResetPassword}
            >
              Reset Password
            </Button>
          </>
        )}

        <Text>
          Remember your password?{' '}
          <Link to="/login" style={{ color: 'blue' }}>
            Login
          </Link>
        </Text>
      </VStack>
    </Box>
  );
}

export default ForgotPassword; 