import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Button,
  useDisclosure,
  HStack,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Avatar,
  AvatarGroup,
  Card,
  CardHeader,
  CardBody,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import AddExpense from '../expenses/AddExpense';

function GroupDetail() {
  const { id: groupId } = useParams();
  const { groups, calculateBalances } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const group = groups.find(g => g.id === parseInt(groupId));
  const balances = calculateBalances(parseInt(groupId));

  if (!group) {
    return (
      <Box textAlign="center" py={10}>
        <Heading size="md">Group not found</Heading>
      </Box>
    );
  }

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
    <Box p={4}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <VStack align="start" spacing={1}>
            <Heading size="lg">{group.name}</Heading>
            {group.description && (
              <Text color="gray.600">{group.description}</Text>
            )}
          </VStack>
          <Button colorScheme="blue" onClick={onOpen}>
            Add Expense
          </Button>
        </HStack>

        {/* Members Section */}
        <Card variant="outline">
          <CardHeader>
            <Heading size="md">Members</Heading>
          </CardHeader>
          <CardBody>
            <HStack spacing={4}>
              <AvatarGroup size="md" max={5}>
                {group.members.map(member => (
                  <Avatar
                    key={member.id}
                    name={member.name}
                  />
                ))}
              </AvatarGroup>
              <Text>{group.members.length} members</Text>
            </HStack>
          </CardBody>
        </Card>

        {/* Balances Section */}
        <Card variant="outline">
          <CardHeader>
            <Heading size="md">Balances</Heading>
          </CardHeader>
          <CardBody>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Member</Th>
                  <Th isNumeric>Balance</Th>
                </Tr>
              </Thead>
              <Tbody>
                {group.members.map(member => (
                  <Tr key={member.id}>
                    <Td>
                      <HStack>
                        <Avatar size="sm" name={member.name} />
                        <Text>{member.name}</Text>
                      </HStack>
                    </Td>
                    <Td isNumeric>
                      <Text
                        color={balances[member.id] >= 0 ? "green.500" : "red.500"}
                        fontWeight="bold"
                      >
                        {formatAmount(balances[member.id] || 0)}
                      </Text>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>

        {/* Expenses Section */}
        <Card variant="outline">
          <CardHeader>
            <Heading size="md">Expenses</Heading>
          </CardHeader>
          <CardBody>
            {group.expenses.length === 0 ? (
              <Text color="gray.500" textAlign="center">No expenses yet</Text>
            ) : (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Description</Th>
                    <Th>Paid By</Th>
                    <Th>Category</Th>
                    <Th>Date</Th>
                    <Th isNumeric>Amount</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {group.expenses.map(expense => (
                    <Tr key={expense.id}>
                      <Td>{expense.description}</Td>
                      <Td>
                        <HStack>
                          <Avatar
                            size="sm"
                            name={group.members.find(m => m.id === expense.paidBy)?.name}
                          />
                          <Text>
                            {group.members.find(m => m.id === expense.paidBy)?.name}
                          </Text>
                        </HStack>
                      </Td>
                      <Td>
                        <Badge colorScheme={expense.category === 'others' ? 'gray' : 'blue'}>
                          {expense.category || 'Others'}
                        </Badge>
                      </Td>
                      <Td>{formatDate(expense.date)}</Td>
                      <Td isNumeric fontWeight="bold">
                        {formatAmount(expense.amount)}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </CardBody>
        </Card>

        {/* Add Expense Modal */}
        <AddExpense
          isOpen={isOpen}
          onClose={onClose}
          groupId={parseInt(groupId)}
          group={group}
        />
      </VStack>
    </Box>
  );
}

export default GroupDetail; 