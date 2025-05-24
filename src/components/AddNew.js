import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Input,
  Button,
  Select,
  NumberInput,
  NumberInputField,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormControl,
  FormLabel,
  useColorModeValue,
  Textarea,
  Avatar,
  Checkbox,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { FiX, FiDollarSign, FiUsers } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

function AddNew() {
  const [expenseData, setExpenseData] = useState({
    description: '',
    amount: '',
    group: '',
    splitType: 'equal',
    paidBy: 'you',
    category: 'general',
    notes: '',
    participants: []
  });

  const [groupData, setGroupData] = useState({
    name: '',
    type: 'home',
    participants: []
  });

  const navigate = useNavigate();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');

  // Mock data - replace with API calls
  const friends = [
    { id: 1, name: 'Marcel P.' },
    { id: 2, name: 'Ada L.' },
    { id: 3, name: 'Nellie B.' },
    { id: 4, name: 'Ernest H.' }
  ];

  const groups = [
    { id: 1, name: 'Our apartment' },
    { id: 2, name: 'Weekend Trip' },
    { id: 3, name: 'Coffee Club' }
  ];

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    // Add API call here to save expense
    toast({
      title: 'Expense added.',
      description: "We've added your new expense.",
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    navigate(-1);
  };

  const handleGroupSubmit = (e) => {
    e.preventDefault();
    // Add API call here to save group
    toast({
      title: 'Group created.',
      description: "We've created your new group.",
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    navigate('/groups');
  };

  const toggleParticipant = (id, type) => {
    if (type === 'expense') {
      setExpenseData(prev => ({
        ...prev,
        participants: prev.participants.includes(id)
          ? prev.participants.filter(p => p !== id)
          : [...prev.participants, id]
      }));
    } else {
      setGroupData(prev => ({
        ...prev,
        participants: prev.participants.includes(id)
          ? prev.participants.filter(p => p !== id)
          : [...prev.participants, id]
      }));
    }
  };

  return (
    <Box>
      <Box bg="teal.500" pt={8} pb={4}>
        <Container maxW="container.lg">
          <HStack justify="space-between" align="center">
            <Heading color="white" size="lg">Add New</Heading>
            <IconButton
              icon={<FiX />}
              variant="ghost"
              colorScheme="whiteAlpha"
              onClick={() => navigate(-1)}
              aria-label="Close"
            />
          </HStack>
        </Container>
      </Box>

      <Container maxW="container.lg" py={4}>
        <Box bg={bgColor} p={6} rounded="lg" shadow="sm">
          <Tabs isFitted variant="enclosed">
            <TabList mb="1em">
              <Tab><HStack><FiDollarSign /><Text>Add Expense</Text></HStack></Tab>
              <Tab><HStack><FiUsers /><Text>Create Group</Text></HStack></Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <form onSubmit={handleExpenseSubmit}>
                  <VStack spacing={4} align="stretch">
                    <FormControl isRequired>
                      <FormLabel>Description</FormLabel>
                      <Input
                        placeholder="Enter a description"
                        value={expenseData.description}
                        onChange={(e) => setExpenseData(prev => ({
                          ...prev,
                          description: e.target.value
                        }))}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Amount</FormLabel>
                      <NumberInput min={0}>
                        <NumberInputField
                          placeholder="0.00"
                          value={expenseData.amount}
                          onChange={(e) => setExpenseData(prev => ({
                            ...prev,
                            amount: e.target.value
                          }))}
                        />
                      </NumberInput>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Group</FormLabel>
                      <Select
                        value={expenseData.group}
                        onChange={(e) => setExpenseData(prev => ({
                          ...prev,
                          group: e.target.value
                        }))}
                      >
                        <option value="">No group</option>
                        {groups.map(group => (
                          <option key={group.id} value={group.id}>
                            {group.name}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Category</FormLabel>
                      <Select
                        value={expenseData.category}
                        onChange={(e) => setExpenseData(prev => ({
                          ...prev,
                          category: e.target.value
                        }))}
                      >
                        <option value="general">General</option>
                        <option value="groceries">Groceries</option>
                        <option value="utilities">Utilities</option>
                        <option value="rent">Rent</option>
                        <option value="entertainment">Entertainment</option>
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Split Type</FormLabel>
                      <Select
                        value={expenseData.splitType}
                        onChange={(e) => setExpenseData(prev => ({
                          ...prev,
                          splitType: e.target.value
                        }))}
                      >
                        <option value="equal">Split equally</option>
                        <option value="exact">Split by exact amounts</option>
                        <option value="percent">Split by percentages</option>
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Participants</FormLabel>
                      <VStack align="stretch" spacing={2}>
                        {friends.map(friend => (
                          <Checkbox
                            key={friend.id}
                            isChecked={expenseData.participants.includes(friend.id)}
                            onChange={() => toggleParticipant(friend.id, 'expense')}
                          >
                            <HStack>
                              <Avatar size="sm" name={friend.name} />
                              <Text>{friend.name}</Text>
                            </HStack>
                          </Checkbox>
                        ))}
                      </VStack>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Notes</FormLabel>
                      <Textarea
                        placeholder="Add any notes..."
                        value={expenseData.notes}
                        onChange={(e) => setExpenseData(prev => ({
                          ...prev,
                          notes: e.target.value
                        }))}
                      />
                    </FormControl>

                    <Button type="submit" colorScheme="teal" size="lg">
                      Add Expense
                    </Button>
                  </VStack>
                </form>
              </TabPanel>

              <TabPanel>
                <form onSubmit={handleGroupSubmit}>
                  <VStack spacing={4} align="stretch">
                    <FormControl isRequired>
                      <FormLabel>Group Name</FormLabel>
                      <Input
                        placeholder="Enter group name"
                        value={groupData.name}
                        onChange={(e) => setGroupData(prev => ({
                          ...prev,
                          name: e.target.value
                        }))}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Group Type</FormLabel>
                      <Select
                        value={groupData.type}
                        onChange={(e) => setGroupData(prev => ({
                          ...prev,
                          type: e.target.value
                        }))}
                      >
                        <option value="home">Home</option>
                        <option value="trip">Trip</option>
                        <option value="social">Social</option>
                        <option value="other">Other</option>
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Add Members</FormLabel>
                      <VStack align="stretch" spacing={2}>
                        {friends.map(friend => (
                          <Checkbox
                            key={friend.id}
                            isChecked={groupData.participants.includes(friend.id)}
                            onChange={() => toggleParticipant(friend.id, 'group')}
                          >
                            <HStack>
                              <Avatar size="sm" name={friend.name} />
                              <Text>{friend.name}</Text>
                            </HStack>
                          </Checkbox>
                        ))}
                      </VStack>
                    </FormControl>

                    <Button type="submit" colorScheme="teal" size="lg">
                      Create Group
                    </Button>
                  </VStack>
                </form>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </Box>
  );
}

export default AddNew; 