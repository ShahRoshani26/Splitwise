import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Select,
  NumberInput,
  NumberInputField,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  HStack,
  Checkbox,
  CheckboxGroup,
  SimpleGrid,
  Avatar,
} from '@chakra-ui/react';
import { useUser } from '../../context/UserContext';

function AddExpense({ isOpen, onClose, groupId, group }) {
  const { user, addExpense } = useUser();
  const toast = useToast();

  const [expense, setExpense] = useState({
    description: '',
    amount: '',
    paidBy: user?.id,
    splitBetween: [],
    date: new Date().toISOString().split('T')[0],
    category: '',
    notes: '',
  });

  const [selectedMembers, setSelectedMembers] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmountChange = (value) => {
    setExpense(prev => ({
      ...prev,
      amount: value
    }));
  };

  const handleMemberSelect = (selectedIds) => {
    setSelectedMembers(selectedIds);
    setExpense(prev => ({
      ...prev,
      splitBetween: selectedIds
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!expense.description || !expense.amount) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (selectedMembers.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one member to split with',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const newExpense = {
        ...expense,
        amount: parseFloat(expense.amount),
        splitBetween: selectedMembers,
        timestamp: new Date().toISOString()
      };

      addExpense(groupId, newExpense);

      toast({
        title: 'Success',
        description: 'Expense added successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Reset form
      setExpense({
        description: '',
        amount: '',
        paidBy: user?.id,
        splitBetween: [],
        date: new Date().toISOString().split('T')[0],
        category: '',
        notes: '',
      });
      setSelectedMembers([]);
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add expense',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Expense</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Input
                name="description"
                placeholder="What was this expense for?"
                value={expense.description}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Amount (₹)</FormLabel>
              <NumberInput
                min={0}
                value={expense.amount}
                onChange={handleAmountChange}
              >
                <NumberInputField
                  placeholder="Enter amount"
                  name="amount"
                />
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Category</FormLabel>
              <Select
                name="category"
                value={expense.category}
                onChange={handleChange}
                placeholder="Select category"
              >
                <option value="food">Food</option>
                <option value="transport">Transport</option>
                <option value="shopping">Shopping</option>
                <option value="utilities">Utilities</option>
                <option value="entertainment">Entertainment</option>
                <option value="others">Others</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Date</FormLabel>
              <Input
                name="date"
                type="date"
                value={expense.date}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Paid By</FormLabel>
              <Select
                name="paidBy"
                value={expense.paidBy}
                onChange={handleChange}
              >
                {group?.members.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name} {member.id === user?.id ? '(You)' : ''}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Split Between</FormLabel>
              <Box maxH="200px" overflowY="auto" p={2} borderWidth={1} borderRadius="md">
                <CheckboxGroup
                  value={selectedMembers}
                  onChange={handleMemberSelect}
                >
                  <SimpleGrid columns={2} spacing={3}>
                    {group?.members.map(member => (
                      <Checkbox key={member.id} value={member.id}>
                        <HStack>
                          <Avatar size="xs" name={member.name} />
                          <Text>{member.name} {member.id === user?.id ? '(You)' : ''}</Text>
                        </HStack>
                      </Checkbox>
                    ))}
                  </SimpleGrid>
                </CheckboxGroup>
              </Box>
            </FormControl>

            <FormControl>
              <FormLabel>Notes</FormLabel>
              <Input
                name="notes"
                placeholder="Add any additional notes"
                value={expense.notes}
                onChange={handleChange}
              />
            </FormControl>

            <HStack spacing={4} justify="flex-end" w="full">
              <Button onClick={onClose}>Cancel</Button>
              <Button colorScheme="blue" onClick={handleSubmit}>
                Add Expense
              </Button>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default AddExpense; 