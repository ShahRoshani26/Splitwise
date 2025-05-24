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
} from '@chakra-ui/react';
import { useUser } from '../../context/UserContext';

function AddTransaction({ isOpen, onClose, groupId }) {
  const { user, addExpense } = useUser();
  const toast = useToast();

  const [transaction, setTransaction] = useState({
    description: '',
    amount: '',
    paidBy: user?.id || '',
    splitBetween: [],
    date: new Date().toISOString().split('T')[0],
    category: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransaction(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmountChange = (value) => {
    setTransaction(prev => ({
      ...prev,
      amount: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!transaction.description || !transaction.amount) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      // Add the expense to the group
      addExpense(groupId, {
        ...transaction,
        amount: parseFloat(transaction.amount),
        timestamp: new Date().toISOString()
      });

      toast({
        title: 'Success',
        description: 'Transaction added successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Reset form and close modal
      setTransaction({
        description: '',
        amount: '',
        paidBy: user?.id || '',
        splitBetween: [],
        date: new Date().toISOString().split('T')[0],
        category: '',
        notes: ''
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add transaction',
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
        <ModalHeader>Add New Transaction</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Input
                name="description"
                placeholder="What was this expense for?"
                value={transaction.description}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Amount (₹)</FormLabel>
              <NumberInput
                min={0}
                value={transaction.amount}
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
                value={transaction.category}
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
                value={transaction.date}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Notes</FormLabel>
              <Input
                name="notes"
                placeholder="Add any additional notes"
                value={transaction.notes}
                onChange={handleChange}
              />
            </FormControl>

            <Box w="full">
              <Text mb={2} fontWeight="medium">Split Details</Text>
              <Text fontSize="sm" color="gray.600">
                This expense will be split equally among all group members
              </Text>
            </Box>

            <HStack spacing={4} justify="flex-end" w="full">
              <Button onClick={onClose}>Cancel</Button>
              <Button colorScheme="blue" onClick={handleSubmit}>
                Add Transaction
              </Button>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default AddTransaction; 