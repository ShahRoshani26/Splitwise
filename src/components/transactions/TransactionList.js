import React from 'react';
import {
  Box,
  VStack,
  Text,
  Badge,
  HStack,
  Divider,
} from '@chakra-ui/react';

function TransactionList({ transactions = [] }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getCategoryColor = (category) => {
    const colors = {
      food: 'orange',
      transport: 'blue',
      shopping: 'purple',
      utilities: 'green',
      entertainment: 'pink',
      others: 'gray'
    };
    return colors[category] || 'gray';
  };

  if (transactions.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Text color="gray.500">No transactions yet</Text>
      </Box>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      {transactions.map((transaction, index) => (
        <Box key={transaction.id || index} p={4} bg="white" rounded="lg" shadow="sm">
          <HStack justify="space-between" mb={2}>
            <Text fontSize="lg" fontWeight="medium">
              {transaction.description}
            </Text>
            <Text
              fontSize="lg"
              fontWeight="bold"
              color={transaction.amount > 0 ? "green.500" : "red.500"}
            >
              {formatAmount(transaction.amount)}
            </Text>
          </HStack>

          <HStack spacing={4} mb={2}>
            <Badge colorScheme={getCategoryColor(transaction.category)}>
              {transaction.category || 'Uncategorized'}
            </Badge>
            <Text fontSize="sm" color="gray.500">
              {formatDate(transaction.date)}
            </Text>
          </HStack>

          {transaction.notes && (
            <>
              <Divider my={2} />
              <Text fontSize="sm" color="gray.600">
                {transaction.notes}
              </Text>
            </>
          )}
        </Box>
      ))}
    </VStack>
  );
}

export default TransactionList; 