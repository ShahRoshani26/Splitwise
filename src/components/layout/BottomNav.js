import React from 'react';
import {
  Box,
  HStack,
  IconButton,
  useColorModeValue,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { FiUsers, FiUser, FiPlusCircle, FiMessageSquare, FiUserPlus } from 'react-icons/fi';

const NavButton = ({ icon, label, to, isActive }) => {
  const activeColor = useColorModeValue('teal.500', 'teal.300');
  const inactiveColor = useColorModeValue('gray.600', 'gray.400');
  
  return (
    <Link to={to}>
      <VStack spacing={1} align="center">
        <IconButton
          icon={icon}
          variant="ghost"
          color={isActive ? activeColor : inactiveColor}
          aria-label={label}
          size="lg"
        />
        <Text
          fontSize="xs"
          color={isActive ? activeColor : inactiveColor}
          fontWeight={isActive ? "bold" : "normal"}
        >
          {label}
        </Text>
      </VStack>
    </Link>
  );
};

function BottomNav() {
  const location = useLocation();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      borderTop="1px"
      borderColor={borderColor}
      bg={bgColor}
      py={2}
      px={4}
      zIndex={1000}
    >
      <HStack justify="space-between" maxW="container.lg" mx="auto">
        <NavButton
          icon={<FiUserPlus />}
          label="Friends"
          to="/friends"
          isActive={location.pathname === '/friends'}
        />
        <NavButton
          icon={<FiUsers />}
          label="Groups"
          to="/groups"
          isActive={location.pathname === '/groups'}
        />
        <Box position="relative" top="-20px">
          <Link to="/add">
            <IconButton
              icon={<FiPlusCircle />}
              colorScheme="teal"
              rounded="full"
              size="lg"
              fontSize="3xl"
              aria-label="Add Expense"
              shadow="lg"
              _hover={{ transform: 'scale(1.1)' }}
              transition="all 0.2s"
            />
          </Link>
        </Box>
        <NavButton
          icon={<FiMessageSquare />}
          label="Activity"
          to="/activity"
          isActive={location.pathname === '/activity'}
        />
        <NavButton
          icon={<FiUser />}
          label="Me"
          to="/profile"
          isActive={location.pathname === '/profile'}
        />
      </HStack>
    </Box>
  );
}

export default BottomNav; 