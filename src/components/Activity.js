import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Badge,
  Icon,
  Button,
  Spinner,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { FiShoppingBag, FiHome, FiWifi, FiDollarSign } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { activities as activitiesApi } from '../services/api';

function Activity() {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const bgColor = useColorModeValue('white', 'gray.800');
  const toast = useToast();

  const loadActivities = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await activitiesApi.getAll();
      setActivities(response.activities || []);
    } catch (error) {
      console.error('Error loading activities:', error);
      toast({
        title: 'Error loading activities',
        description: error.message || 'Failed to load activities',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setActivities([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'groceries':
        return FiShoppingBag;
      case 'utilities':
        return FiWifi;
      case 'settlement':
        return FiDollarSign;
      default:
        return FiHome;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="teal.500" />
      </Box>
    );
  }

  return (
    <Box>
      <Box bg="teal.500" pt={8} pb={4}>
        <Container maxW="container.lg">
          <Heading color="white" size="lg">Activity</Heading>
        </Container>
      </Box>

      <Container maxW="container.lg" py={4}>
        {activities.length === 0 ? (
          <Box
            p={8}
            bg={bgColor}
            rounded="lg"
            textAlign="center"
            shadow="sm"
          >
            <Text fontSize="lg" mb={4}>No recent activity</Text>
            <Link to="/add">
              <Button colorScheme="teal">Add an expense</Button>
            </Link>
          </Box>
        ) : (
          <VStack spacing={4} align="stretch">
            {activities.map((activity) => (
              <Box
                key={activity.id}
                p={4}
                bg={bgColor}
                shadow="sm"
                rounded="lg"
                borderWidth="1px"
              >
                <HStack spacing={4} align="start">
                  <Box
                    p={2}
                    bg="gray.100"
                    rounded="full"
                    color="gray.600"
                  >
                    <Icon as={getCategoryIcon(activity.category)} boxSize={5} />
                  </Box>
                  <VStack align="start" spacing={1} flex={1}>
                    <HStack justify="space-between" w="full">
                      <Text fontWeight="bold">
                        {activity.user}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {formatDate(activity.date)}
                      </Text>
                    </HStack>
                    <Text>{activity.description}</Text>
                    {activity.group && (
                      <Badge colorScheme="teal">
                        {activity.group}
                      </Badge>
                    )}
                    {activity.amount > 0 && (
                      <Text fontWeight="semibold">
                        {formatCurrency(activity.amount)}
                      </Text>
                    )}
                  </VStack>
                </HStack>
              </Box>
            ))}
          </VStack>
        )}
      </Container>
    </Box>
  );
}

export default Activity; 