import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Avatar,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  useDisclosure,
  Spinner,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { FiSearch, FiUserPlus, FiMail } from 'react-icons/fi';
import { friends as friendsApi } from '../services/api';

function Friends() {
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [newFriendEmail, setNewFriendEmail] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('white', 'gray.800');
  const toast = useToast();

  const loadFriends = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await friendsApi.getAll();
      setFriends(response.friends || []);
    } catch (error) {
      console.error('Error loading friends:', error);
      toast({
        title: 'Error loading friends',
        description: error.message || 'Failed to load friends',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setFriends([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadFriends();
  }, [loadFriends]);

  const handleAddFriend = async () => {
    try {
      await friendsApi.add({ email: newFriendEmail });
      toast({
        title: 'Friend added',
        description: 'Friend has been added successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
      setNewFriendEmail('');
      loadFriends(); // Reload friends list
    } catch (error) {
      toast({
        title: 'Error adding friend',
        description: error.message || 'Failed to add friend',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleInviteFriend = async () => {
    try {
      await friendsApi.invite(newFriendEmail);
      toast({
        title: 'Invitation sent',
        description: 'Friend has been invited successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
      setNewFriendEmail('');
    } catch (error) {
      toast({
        title: 'Error sending invitation',
        description: error.message || 'Failed to send invitation',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
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
          <Heading color="white" size="lg" mb={4}>Friends</Heading>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Search friends by name or email"
              bg="white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </Container>
      </Box>

      <Container maxW="container.lg" py={4}>
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between">
            <Button leftIcon={<FiUserPlus />} colorScheme="teal" onClick={onOpen}>
              Add Friend
            </Button>
            <Button leftIcon={<FiMail />} variant="outline" onClick={onOpen}>
              Invite Friends
            </Button>
          </HStack>

          {friends.length === 0 ? (
            <Box
              p={8}
              bg={bgColor}
              rounded="lg"
              textAlign="center"
              shadow="sm"
            >
              <Text fontSize="lg" mb={4}>You haven't added any friends yet</Text>
              <Button leftIcon={<FiUserPlus />} colorScheme="teal" onClick={onOpen}>
                Add your first friend
              </Button>
            </Box>
          ) : (
            <VStack spacing={2} align="stretch">
              {friends.map((friend) => (
                <Box
                  key={friend.id}
                  p={4}
                  bg={bgColor}
                  shadow="sm"
                  rounded="lg"
                  borderWidth="1px"
                >
                  <HStack justify="space-between">
                    <HStack spacing={4}>
                      <Avatar name={friend.name} size="md" />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="bold">{friend.name}</Text>
                        <Text fontSize="sm" color="gray.500">{friend.email}</Text>
                      </VStack>
                    </HStack>
                    {friend.balance !== 0 && (
                      <Text
                        fontWeight="bold"
                        color={friend.balance > 0 ? 'green.500' : 'red.500'}
                      >
                        {friend.balance > 0 ? '+' : '-'}
                        {formatCurrency(friend.balance)}
                      </Text>
                    )}
                    {friend.balance === 0 && (
                      <Text color="gray.500">settled up</Text>
                    )}
                  </HStack>
                </Box>
              ))}
            </VStack>
          )}
        </VStack>
      </Container>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a Friend</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                placeholder="friend@example.com"
                value={newFriendEmail}
                onChange={(e) => setNewFriendEmail(e.target.value)}
              />
            </FormControl>
            <HStack mt={6} spacing={4}>
              <Button colorScheme="teal" onClick={handleAddFriend}>
                Add Friend
              </Button>
              <Button variant="outline" onClick={handleInviteFriend}>
                Send Invitation
              </Button>
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Friends; 