import React from 'react';
import {
  Box,
  useColorModeValue,
} from '@chakra-ui/react';
import BottomNav from './BottomNav';

function Layout({ children }) {
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box minH="100vh" bg={bgColor}>
      <Box pb="70px"> {/* Add padding to account for bottom nav */}
        {children}
      </Box>
      <BottomNav />
    </Box>
  );
}

export default Layout; 