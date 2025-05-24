import React from 'react';
import {
  Box,
  Flex,
  HStack,
  Container,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import Logo from './Logo';

function Navbar() {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      bg={bg}
      borderBottom={1}
      borderStyle="solid"
      borderColor={borderColor}
      position="fixed"
      w="100%"
      zIndex="1000"
    >
      <Container maxW="container.xl">
        <Flex
          minH="60px"
          py={{ base: 2 }}
          px={{ base: 4 }}
          align="center"
          justify="space-between"
        >
          <HStack spacing={8} alignItems="center">
            <Box as={RouterLink} to="/" display="flex" alignItems="center">
              <Logo width="150px" height="40px" />
            </Box>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}

export default Navbar;