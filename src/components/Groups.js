import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Avatar,
  AvatarGroup,
  Button,
  useColorModeValue,
  Icon,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { FiUsers, FiHome, FiCoffee, FiCompass } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function Groups() {
  const bgColor = useColorModeValue('white', 'gray.800');
  const { user, groups = [], isLoading, calculateBalances } = useUser();
  const [balances, setBalances] = useState({});
  const toast = useToast();

  useEffect(() => {
    const loadBalances = async () => {
      if (!groups || groups.length === 0) return;

      try {
        const balancePromises = groups.map(async (group) => {
          const groupBalance = await calculateBalances(group.id);
          return { [group.id]: groupBalance };
        });

        const balanceResults = await Promise.all(balancePromises);
        const combinedBalances = balanceResults.reduce((acc, curr) => ({
          ...acc,
          ...curr
        }), {});

        setBalances(combinedBalances);
      } catch (error) {
        toast({
          title: 'Error loading balances',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    loadBalances();
  }, [groups, calculateBalances, toast]);

  const getGroupIcon = (type) => {
    switch (type) {
      case 'home':
        return FiHome;
      case 'trip':
        return FiCompass;
      case 'social':
        return FiCoffee;
      default:
        return FiUsers;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.abs(amount));
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
          <HStack justify="space-between" align="center">
            <Heading color="white" size="lg">Groups</Heading>
            <Link to="/add">
              <Button colorScheme="whiteAlpha">
                Create a group
              </Button>
            </Link>
          </HStack>
        </Container>
      </Box>

      <Container maxW="container.lg" py={4}>
        {!groups || groups.length === 0 ? (
          <Box
            p={8}
            bg={bgColor}
            rounded="lg"
            textAlign="center"
            shadow="sm"
          >
            <Text fontSize="lg" mb={4}>You haven't created any groups yet.</Text>
            <Link to="/add">
              <Button colorScheme="teal">Create your first group</Button>
            </Link>
          </Box>
        ) : (
          <VStack spacing={4} align="stretch">
            {groups.map((group) => {
              const groupBalance = balances[group.id] || {};
              const userBalance = groupBalance[user?.id] || 0;

              return (
                <Box
                  key={group.id}
                  p={4}
                  bg={bgColor}
                  shadow="sm"
                  rounded="lg"
                  borderWidth="1px"
                  _hover={{ shadow: 'md' }}
                  cursor="pointer"
                >
                  <HStack spacing={4} align="start">
                    <Box
                      p={3}
                      bg="gray.100"
                      rounded="full"
                      color="gray.600"
                    >
                      <Icon as={getGroupIcon(group.type)} boxSize={6} />
                    </Box>
                    <VStack align="start" spacing={2} flex={1}>
                      <HStack justify="space-between" w="full">
                        <VStack align="start" spacing={1}>
                          <Text fontSize="lg" fontWeight="bold">
                            {group.name}
                          </Text>
                          <AvatarGroup size="sm" max={3}>
                            {group.members?.map(member => (
                              <Avatar
                                key={member.id}
                                name={member.name}
                                size="sm"
                              />
                            ))}
                          </AvatarGroup>
                        </VStack>
                        <VStack align="end" spacing={1}>
                          {userBalance > 0 && (
                            <Text color="green.500" fontWeight="semibold">
                              you are owed {formatCurrency(userBalance)}
                            </Text>
                          )}
                          {userBalance < 0 && (
                            <Text color="red.500" fontWeight="semibold">
                              you owe {formatCurrency(userBalance)}
                            </Text>
                          )}
                          {userBalance === 0 && (
                            <Text color="gray.500">all settled up</Text>
                          )}
                        </VStack>
                      </HStack>
                    </VStack>
                  </HStack>
                </Box>
              );
            })}
          </VStack>
        )}
      </Container>
    </Box>
  );
}

export default Groups; 