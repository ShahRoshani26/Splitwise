import React from 'react';
import {
  Box,
  Container,
  useColorModeValue,
  Text,
  Button,
  Stack,
  VStack,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import Logo from './Logo';

function LandingPage() {
  return (
    <Box position="relative" h="100vh" overflow="hidden">
      {/* Background Pattern - Coral */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        height="60vh"
        bgGradient="linear(to-br, #FF7F6B, #FF6B5B)"
        transform="skewY(-8deg)"
        transformOrigin="top left"
        zIndex={0}
      />
      
      {/* Background Pattern - Mint */}
      <Box
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        height="60vh"
        bgGradient="linear(to-br, #A7E8D0, #68D5B8)"
        transform="skewY(8deg)"
        transformOrigin="bottom right"
        zIndex={0}
      />
      
      {/* Background Pattern - Purple */}
      <Box
        position="absolute"
        bottom="20vh"
        left="0"
        right="0"
        height="40vh"
        bgGradient="linear(to-br, #B4A1D8, #9B85C9)"
        transform="skewY(-12deg)"
        transformOrigin="bottom left"
        zIndex={0}
      />

      {/* Content */}
      <Container maxW="container.xl" position="relative" zIndex={1}>
        <VStack
          spacing={8}
          align="center"
          justify="center"
          minH="100vh"
          textAlign="center"
          px={{ base: 4, md: 8 }}
        >
          <Box mb={{ base: 6, md: 8 }}>
            <Logo width={{ base: "200px", md: "300px" }} height={{ base: "60px", md: "80px" }} />
          </Box>
          
          <Text
            fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
            color={useColorModeValue('gray.700', 'gray.300')}
            maxW="800px"
            lineHeight="1.4"
            mb={{ base: 6, md: 8 }}
          >
            Split expenses with friends and family effortlessly.
            Track balances, settle up, and stay organized.
          </Text>

          <Stack
            direction={{ base: 'column', sm: 'row' }}
            spacing={{ base: 4, sm: 6 }}
            w={{ base: "full", sm: "auto" }}
          >
            <Button
              as={RouterLink}
              to="/register"
              size="lg"
              colorScheme="teal"
              px={8}
              fontSize={{ base: "md", md: "lg" }}
              height={{ base: "48px", md: "56px" }}
              width={{ base: "full", sm: "auto" }}
              minW={{ sm: "200px" }}
            >
              Get Started
            </Button>
            <Button
              as={RouterLink}
              to="/login"
              size="lg"
              variant="outline"
              colorScheme="teal"
              px={8}
              fontSize={{ base: "md", md: "lg" }}
              height={{ base: "48px", md: "56px" }}
              width={{ base: "full", sm: "auto" }}
              minW={{ sm: "200px" }}
            >
              Sign In
            </Button>
          </Stack>
        </VStack>
      </Container>
    </Box>
  );
}

export default LandingPage; 