import React from 'react';
import {
  Box,
  VStack,
  Heading,
  SimpleGrid,
  Text,
  Badge,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react';
import { useUser } from '../context/UserContext';

function Dashboard() {
  const { groups } = useUser();

  // Calculate total amounts from all transactions
  const calculateTotals = () => {
    let totalOwed = 0;
    let totalOwe = 0;

    groups.forEach(group => {
      group.expenses.forEach(expense => {
        if (expense.paidBy === group.members[0].id) {
          // If you paid, others owe you
          totalOwed += (expense.amount / group.members.length) * (group.members.length - 1);
        } else {
          // If someone else paid, you owe your share
          totalOwe += expense.amount / group.members.length;
        }
      });
    });

    return {
      totalOwed,
      totalOwe,
      netBalance: totalOwed - totalOwe
    };
  };

  const { totalOwed, totalOwe, netBalance } = calculateTotals();

  // Get recent activities from all groups
  const getRecentActivities = () => {
    const allActivities = groups.flatMap(group => 
      group.expenses.map(expense => ({
        ...expense,
        groupName: group.name,
        groupId: group.id
      }))
    );

    // Sort by date, most recent first
    return allActivities.sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    ).slice(0, 5); // Get only the 5 most recent activities
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          {/* Amount you are owed */}
          <Box p={6} bg="white" rounded="lg" shadow="sm">
            <Stat>
              <StatLabel color="gray.600">Total You Are Owed</StatLabel>
              <StatNumber color="green.500">
                {formatAmount(totalOwed)}
              </StatNumber>
              <StatHelpText>To Receive</StatHelpText>
            </Stat>
          </Box>

          {/* Amount you owe */}
          <Box p={6} bg="white" rounded="lg" shadow="sm">
            <Stat>
              <StatLabel color="gray.600">Total You Owe</StatLabel>
              <StatNumber color="red.500">
                {formatAmount(totalOwe)}
              </StatNumber>
              <StatHelpText>To Pay</StatHelpText>
            </Stat>
          </Box>

          {/* Net Balance */}
          <Box p={6} bg="white" rounded="lg" shadow="sm">
            <Stat>
              <StatLabel color="gray.600">Net Balance</StatLabel>
              <StatNumber color={netBalance >= 0 ? "green.500" : "red.500"}>
                {formatAmount(Math.abs(netBalance))}
              </StatNumber>
              <StatHelpText>
                {netBalance >= 0 ? "You will receive" : "You will pay"}
              </StatHelpText>
            </Stat>
          </Box>
        </SimpleGrid>

        {/* Recent Activities */}
        <Box>
          <Heading size="md" mb={4}>Recent Activities</Heading>
          <VStack spacing={4} align="stretch">
            {getRecentActivities().length === 0 ? (
              <Box p={6} bg="white" rounded="lg" shadow="sm" textAlign="center">
                <Text color="gray.500">No recent activities</Text>
              </Box>
            ) : (
              getRecentActivities().map((activity, index) => (
                <Box key={activity.id || index} p={4} bg="white" rounded="lg" shadow="sm">
                  <HStack justify="space-between" mb={2}>
                    <VStack align="start" spacing={1}>
                      <Text fontSize="lg" fontWeight="medium">
                        {activity.description}
                      </Text>
                      <HStack spacing={2}>
                        <Badge colorScheme="blue">
                          {activity.groupName}
                        </Badge>
                        <Text fontSize="sm" color="gray.500">
                          {formatDate(activity.date)}
                        </Text>
                      </HStack>
                    </VStack>
                    <Text
                      fontSize="lg"
                      fontWeight="bold"
                      color={activity.paidBy === activity.groupMembers?.[0]?.id ? "green.500" : "red.500"}
                    >
                      {activity.paidBy === activity.groupMembers?.[0]?.id ? "+" : "-"}
                      {formatAmount(activity.amount / activity.splitBetween.length)}
                    </Text>
                  </HStack>
                </Box>
              ))
            )}
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}

export default Dashboard; 