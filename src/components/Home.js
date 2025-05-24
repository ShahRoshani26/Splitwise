import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  HStack,
  Icon,
  useColorModeValue,
  Container,
  IconButton,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FiHome, FiSettings, FiChevronLeft } from 'react-icons/fi';
import { useUser } from '../context/UserContext';

function Home() {
  const context = useUser();
  
  const memoizedValues = useMemo(() => ({
    groups: context?.groups || [],
    isLoading: context?.isLoading || false,
    getTotalBalance: context?.getTotalBalance
  }), [context]);

  const { groups, isLoading, getTotalBalance } = memoizedValues;
  
  const [totalBalance, setTotalBalance] = useState(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const bgColor = useColorModeValue('teal.400', 'teal.500');
  const toast = useToast();

  useEffect(() => {
    const loadTotalBalance = async () => {
      if (!groups || !getTotalBalance) return;

      try {
        setIsLoadingBalance(true);
        const balance = await getTotalBalance();
        setTotalBalance(balance);
      } catch (error) {
        toast({
          title: 'Error loading balance',
          description: error.message || 'Failed to load balance',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoadingBalance(false);
      }
    };

    loadTotalBalance();
  }, [groups, getTotalBalance, toast]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (isLoading || isLoadingBalance) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="teal.500" />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box bg={bgColor} color="white" pt={12} pb={8}>
        <Container maxW="container.lg">
          <HStack justify="space-between" mb={4}>
            <IconButton
              icon={<FiChevronLeft />}
              variant="ghost"
              color="white"
              aria-label="Back"
              _hover={{ bg: 'whiteAlpha.200' }}
            />
            <Heading size="md">Overall Balance</Heading>
            <IconButton
              icon={<FiSettings />}
              variant="ghost"
              color="white"
              aria-label="Settings"
              _hover={{ bg: 'whiteAlpha.200' }}
            />
          </HStack>

          <VStack spacing={2} align="center">
            {totalBalance && (
              <>
                {totalBalance.netBalance > 0 ? (
                  <Text fontSize="lg">
                    You are owed {formatCurrency(totalBalance.totalOwed)}
                  </Text>
                ) : totalBalance.netBalance < 0 ? (
                  <Text fontSize="lg">
                    You owe {formatCurrency(totalBalance.totalOwe)}
                  </Text>
                ) : (
                  <Text fontSize="lg">You're all settled up!</Text>
                )}
              </>
            )}
            <HStack spacing={4} mt={4}>
              <Button colorScheme="orange" size="lg">
                Settle up
              </Button>
              <Button colorScheme="teal" variant="outline" size="lg">
                Balances
              </Button>
              <Button colorScheme="teal" variant="outline" size="lg">
                More
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Recent Activity */}
      <Container maxW="container.lg" mt={4}>
        {!groups || groups.length === 0 ? (
          <Box
            p={8}
            bg="white"
            rounded="lg"
            textAlign="center"
            shadow="sm"
          >
            <Text fontSize="lg" mb={4}>No recent activity</Text>
            <Button colorScheme="teal" as={Link} to="/add">
              Add your first expense
            </Button>
          </Box>
        ) : (
          <VStack spacing={4} align="stretch">
            {groups.map(group => (
              <Box
                key={group.id}
                p={4}
                bg="white"
                shadow="sm"
                rounded="lg"
                borderWidth="1px"
              >
                <HStack justify="space-between">
                  <HStack spacing={4}>
                    <Icon as={FiHome} boxSize={6} color="gray.500" />
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="medium">{group.name}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {group.members?.length || 0} members
                      </Text>
                    </VStack>
                  </HStack>
                </HStack>
              </Box>
            ))}
          </VStack>
        )}
      </Container>
    </Box>
  );
}

export default Home; 