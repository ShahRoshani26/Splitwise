import React, { useState } from 'react';
import {
  Box,
  Button,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useToast,
  HStack,
  Card,
  CardBody,
  CardHeader,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import AddExpense from '../expenses/AddExpense';

function Groups() {
  const { groups, createGroup } = useUser();
  const { isOpen: isGroupOpen, onOpen: onGroupOpen, onClose: onGroupClose } = useDisclosure();
  const { isOpen: isExpenseOpen, onOpen: onExpenseOpen, onClose: onExpenseClose } = useDisclosure();
  const [newGroup, setNewGroup] = useState({ name: '', description: '' });
  const [selectedGroup, setSelectedGroup] = useState(null);
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewGroup(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateGroup = () => {
    if (!newGroup.name) {
      toast({
        title: 'Error',
        description: 'Please enter a group name',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    createGroup(newGroup);
    setNewGroup({ name: '', description: '' });
    onGroupClose();
    
    toast({
      title: 'Success',
      description: 'Group created successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleAddExpense = (group) => {
    setSelectedGroup(group);
    onExpenseOpen();
  };

  return (
    <Box p={4}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">Groups</Heading>
          <Button colorScheme="blue" onClick={onGroupOpen}>
            Create New Group
          </Button>
        </HStack>

        {groups.length === 0 ? (
          <Box p={6} textAlign="center" bg="white" rounded="lg" shadow="sm">
            <Text color="gray.500">No groups yet. Create your first group!</Text>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {groups.map(group => (
              <Card key={group.id} variant="outline">
                <CardHeader>
                  <HStack justify="space-between">
                    <Heading size="md">{group.name}</Heading>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <VStack align="stretch" spacing={4}>
                    <Text color="gray.600">{group.description}</Text>
                    <Text>Members: {group.members.length}</Text>
                    <HStack spacing={4}>
                      <Button
                        as={Link}
                        to={`/groups/${group.id}`}
                        colorScheme="blue"
                        variant="outline"
                        flex="1"
                      >
                        View Details
                      </Button>
                      <Button
                        colorScheme="green"
                        onClick={() => handleAddExpense(group)}
                        flex="1"
                      >
                        Add Expense
                      </Button>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        )}

        {/* Create Group Modal */}
        <Modal isOpen={isGroupOpen} onClose={onGroupClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create New Group</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Group Name</FormLabel>
                  <Input
                    name="name"
                    placeholder="Enter group name"
                    value={newGroup.name}
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Input
                    name="description"
                    placeholder="Enter group description"
                    value={newGroup.description}
                    onChange={handleChange}
                  />
                </FormControl>

                <Button colorScheme="blue" onClick={handleCreateGroup} w="full">
                  Create Group
                </Button>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Add Expense Modal */}
        {selectedGroup && (
          <AddExpense
            isOpen={isExpenseOpen}
            onClose={onExpenseClose}
            groupId={selectedGroup.id}
            group={selectedGroup}
          />
        )}
      </VStack>
    </Box>
  );
}

export default Groups; 