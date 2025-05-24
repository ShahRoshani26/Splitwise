import React, { useState, useRef } from 'react';
import {
  Box,
  VStack,
  Text,
  Avatar,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  HStack,
  Divider,
  Card,
  CardBody,
  useColorModeValue,
  Container,
  InputGroup,
  InputRightElement,
  IconButton,
  Switch,
  Select,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorMode,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from '@chakra-ui/react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiEye, FiEyeOff, FiUpload, FiBell, FiDollarSign, FiTrash2, FiEdit2 } from 'react-icons/fi';

function Profile() {
  const { user, updateProfile, logout } = useUser();
  const { colorMode, toggleColorMode } = useColorMode();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef();
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const cardBg = useColorModeValue('red.50', 'red.900');
  const cardBorderColor = useColorModeValue('red.100', 'red.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const [isUploading, setIsUploading] = useState(false);
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure();
  
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: user?.currency || 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No activity yet';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobileNumber: user?.mobile || '',
    username: user?.username || '',
    password: user?.password || '',
    currency: user?.currency || 'INR',
    notifications: user?.notifications || true,
    profilePicture: user?.profilePicture || null,
  });
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('photo', file);

      try {
        const response = await fetch('http://localhost:3000/api/users/profile/photo', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });

        if (!response.ok) {
          throw new Error('Failed to upload photo');
        }

        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          profilePicture: `http://localhost:3000${data.profilePhoto}`
        }));

        toast({
          title: 'Success',
          description: 'Profile photo updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to upload profile photo',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDeletePhoto = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users/profile/photo', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete photo');
      }

      setFormData(prev => ({
        ...prev,
        profilePicture: null
      }));

      toast({
        title: 'Success',
        description: 'Profile photo deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onDeleteModalClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete profile photo',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = () => {
    try {
      updateProfile(formData);
      setIsEditing(false);
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged out successfully',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    navigate('/login');
  };

  // Stats data from user object
  const stats = {
    totalExpenses: formatAmount(user?.totalExpenses || 0),
    groupsJoined: user?.groupsCount || 0,
    settledBalance: formatAmount(user?.settledBalance || 0),
    lastActivity: user?.lastActivity ? formatDate(user?.lastActivity) : 'No activity yet'
  };

  const InfoRow = ({ label, value, isPassword = false }) => (
    <HStack w="full" spacing={4} py={2} align="center">
      <Text fontWeight="medium" w="150px">{label}:</Text>
      {isPassword ? (
        <InputGroup size="md" flex={1}>
          <Input
            type={showPassword ? "text" : "password"}
            value={value}
            isReadOnly
            pr="4.5rem"
          />
          <InputRightElement width="4.5rem">
            <IconButton
              h="1.75rem"
              size="sm"
              onClick={() => setShowPassword(!showPassword)}
              icon={showPassword ? <FiEyeOff /> : <FiEye />}
              aria-label={showPassword ? "Hide password" : "Show password"}
            />
          </InputRightElement>
        </InputGroup>
      ) : (
        <Text flex={1}>{value}</Text>
      )}
    </HStack>
  );

  return (
    <Container maxW="container.lg" pt={2} pb={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="left">
          <Heading size="lg">Profile</Heading>
          <Text color="gray.500">Manage your account settings and preferences</Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          <Card>
            <CardBody>
              <VStack spacing={8} align="stretch">
                <Box textAlign="center" position="relative">
                  <Box position="relative" display="inline-block">
                    {formData.profilePicture ? (
                      <Image
                        src={formData.profilePicture}
                        alt={user?.name}
                        borderRadius="full"
                        boxSize="150px"
                        objectFit="cover"
                      />
                    ) : (
                      <Avatar
                        size="2xl"
                        name={user?.name}
                      />
                    )}
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<FiEdit2 />}
                        aria-label="Edit photo"
                        position="absolute"
                        bottom="0"
                        right="0"
                        colorScheme="blue"
                        rounded="full"
                        size="sm"
                        isLoading={isUploading}
                      />
                      <MenuList>
                        <MenuItem
                          icon={<FiUpload />}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Upload Photo
                        </MenuItem>
                        {formData.profilePicture && (
                          <MenuItem
                            icon={<FiTrash2 />}
                            color="red.500"
                            onClick={onDeleteModalOpen}
                          >
                            Delete Photo
                          </MenuItem>
                        )}
                      </MenuList>
                    </Menu>
                  </Box>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <Heading size="lg" mt={4}>{user?.name}</Heading>
                  <Text color="gray.500">{user?.email}</Text>
                </Box>

                <Divider />

                {isEditing ? (
                  <VStack spacing={4} align="stretch">
                    <FormControl>
                      <FormLabel>Name</FormLabel>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Email</FormLabel>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Mobile Number</FormLabel>
                      <Input
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Username</FormLabel>
                      <Input
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Password</FormLabel>
                      <InputGroup>
                        <Input
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleChange}
                        />
                        <InputRightElement width="4.5rem">
                          <IconButton
                            h="1.75rem"
                            size="sm"
                            onClick={() => setShowPassword(!showPassword)}
                            icon={showPassword ? <FiEyeOff /> : <FiEye />}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          />
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Preferred Currency</FormLabel>
                      <Select
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="INR">INR (₹)</option>
                      </Select>
                    </FormControl>

                    <HStack spacing={4} justify="flex-end">
                      <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                      <Button colorScheme="blue" onClick={handleSubmit}>Save Changes</Button>
                    </HStack>
                  </VStack>
                ) : (
                  <VStack spacing={4} align="stretch">
                    <Box bg={bgColor} rounded="lg" p={4}>
                      <VStack spacing={2} align="stretch">
                        <InfoRow label="Name" value={user?.name} />
                        <InfoRow label="Email" value={user?.email} />
                        <InfoRow label="Mobile Number" value={user?.mobile || 'Not set'} />
                        <InfoRow label="Username" value={user?.username || 'Not set'} />
                        <InfoRow 
                          label="Password" 
                          value={user?.password || '********'} 
                          isPassword={true}
                        />
                        <InfoRow label="Currency" value={formData.currency} />
                      </VStack>
                    </Box>

                    <Button
                      alignSelf="flex-end"
                      colorScheme="blue"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  </VStack>
                )}
              </VStack>
            </CardBody>
          </Card>

          <VStack spacing={8}>
            {/* Stats Card */}
            <Card w="full">
              <CardBody>
                <VStack spacing={6}>
                  <Heading size="md">Your Activity</Heading>
                  <SimpleGrid columns={2} spacing={4} w="full">
                    <Stat>
                      <StatLabel>Total Expenses</StatLabel>
                      <StatNumber>{stats.totalExpenses}</StatNumber>
                      <StatHelpText>This month</StatHelpText>
                    </Stat>
                    <Stat>
                      <StatLabel>Groups</StatLabel>
                      <StatNumber>{stats.groupsJoined}</StatNumber>
                      <StatHelpText>Active groups</StatHelpText>
                    </Stat>
                    <Stat>
                      <StatLabel>Settled Balance</StatLabel>
                      <StatNumber>{stats.settledBalance}</StatNumber>
                      <StatHelpText>Last settled</StatHelpText>
                    </Stat>
                    <Stat>
                      <StatLabel>Last Activity</StatLabel>
                      <StatNumber>
                        <Text fontSize="lg">{stats.lastActivity}</Text>
                      </StatNumber>
                    </Stat>
                  </SimpleGrid>
                </VStack>
              </CardBody>
            </Card>

            {/* Preferences Card */}
            <Card w="full">
              <CardBody>
                <VStack spacing={6}>
                  <Heading size="md">Preferences</Heading>
                  <VStack spacing={4} align="stretch" w="full">
                    <HStack justify="space-between">
                      <HStack>
                        <FiBell />
                        <Text>Notifications</Text>
                      </HStack>
                      <Switch
                        isChecked={formData.notifications}
                        onChange={(e) => handleChange({
                          target: {
                            name: 'notifications',
                            value: e.target.checked
                          }
                        })}
                      />
                    </HStack>
                    <HStack justify="space-between">
                      <HStack>
                        <FiDollarSign />
                        <Text>Dark Mode</Text>
                      </HStack>
                      <Switch
                        isChecked={colorMode === 'dark'}
                        onChange={toggleColorMode}
                      />
                    </HStack>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>

            {/* Logout Card */}
            <Card 
              w="full"
              bg={cardBg}
              borderColor={cardBorderColor}
            >
              <CardBody>
                <HStack justify="space-between" align="center">
                  <VStack align="start" spacing={1}>
                    <Text fontSize="lg" fontWeight="bold">Ready to leave?</Text>
                    <Text color={textColor}>
                      You can always log back in anytime
                    </Text>
                  </VStack>
                  <Button
                    leftIcon={<FiLogOut />}
                    colorScheme="red"
                    onClick={handleLogout}
                    _hover={{ bg: 'red.600' }}
                  >
                    Logout
                  </Button>
                </HStack>
              </CardBody>
            </Card>
          </VStack>
        </SimpleGrid>
      </VStack>

      {/* Delete Photo Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Profile Photo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete your profile photo? This action cannot be undone.
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onDeleteModalClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDeletePhoto}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}

export default Profile; 